const bcrypt = require("bcryptjs");
const { OAuth2Client } = require('google-auth-library');
const { User, Profile } = require("../models");

const register = async ({ email, password, firstName, lastName, phone }) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password_hash: passwordHash,
    provider: "local",
    status: "active"
  });

  await Profile.create({ 
    user_id: user.id,
    first_name: firstName,
    last_name: lastName,
    phone: phone 
  });

  return user;
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("EMAIL_OR_PASSWORD_WRONG");
  }

  if (user.status !== "active") {
    throw new Error("USER_NOT_ACTIVE");
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new Error("EMAIL_OR_PASSWORD_WRONG");
  }

  user.last_login_at = new Date();
  await user.save();

  return user;
};

const verifyGoogleToken = async (idToken) => {
  try {
    const client = new OAuth2Client();
    
    const ticket = await client.verifyIdToken({
      idToken,
      audience: [
        process.env.GOOGLE_CLIENT_ID_ANDROID,
        process.env.GOOGLE_CLIENT_ID_IOS,
      ].filter(Boolean),
    });
    
    const payload = ticket.getPayload();
    const { email, sub: googleId, name, picture } = payload;

    // Kullanıcıyı email veya provider_id ile bul
    let user = await User.findOne({ 
      where: { 
        email 
      }
    });
    
    if (!user) {
      // Yeni kullanıcı oluştur
      user = await User.create({
        email,
        provider: "google",
        provider_id: googleId,
        status: "active",
        email_verified: true,
        last_login_at: new Date()
      });

      // Profile oluştur
      await Profile.create({
        user_id: user.id,
        first_name: name?.split(' ')[0] || '',
        last_name: name?.split(' ').slice(1).join(' ') || '',
        avatar_url: picture || null,
      });
    } else {
      // Mevcut kullanıcı varsa provider bilgilerini güncelle
      if (user.provider === 'local' || !user.provider_id) {
        user.provider = 'google';
        user.provider_id = googleId;
        user.email_verified = true;
      }
      
      user.last_login_at = new Date();
      await user.save();
    }

    return user;
  } catch (error) {
    console.error('Google token verification error:', error);
    throw new Error('INVALID_GOOGLE_TOKEN');
  }
};

const verifyAppleToken = async (identityToken, email, fullName) => {
  try {
    const appleSignin = require('apple-signin-auth');
    
    const appleData = await appleSignin.verifyIdToken(identityToken, {
      audience: process.env.APPLE_CLIENT_ID,
      ignoreExpiration: false,
    });

    const appleId = appleData.sub;

    // Apple ID ile kullanıcı bul
    let user = await User.findOne({ 
      where: { 
        provider: 'apple',
        provider_id: appleId 
      }
    });

    // Bulunamazsa email ile dene (varsa)
    if (!user && email) {
      user = await User.findOne({ 
        where: { email }
      });
      
      // Varolan kullanıcıya apple bilgilerini ekle
      if (user) {
        user.provider = 'apple';
        user.provider_id = appleId;
        user.email_verified = true;
        user.last_login_at = new Date();
        await user.save();
      }
    }

    if (!user) {
      // Yeni kullanıcı oluştur
      user = await User.create({
        email: email || `${appleId}@privaterelay.appleid.com`,
        provider: "apple",
        provider_id: appleId,
        status: "active",
        email_verified: true,
        last_login_at: new Date()
      });

      // Profile oluştur
      await Profile.create({
        user_id: user.id,
        first_name: fullName?.givenName || '',
        last_name: fullName?.familyName || '',
      });
    } else {
      user.last_login_at = new Date();
      await user.save();
    }

    return user;
  } catch (error) {
    console.error('Apple token verification error:', error);
    throw new Error('INVALID_APPLE_TOKEN');
  }
};

module.exports = {
  register,
  login,
  verifyGoogleToken,
  verifyAppleToken
};