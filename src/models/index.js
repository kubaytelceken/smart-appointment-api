const sequelize = require("../config/database");

// MODELLER
const UserModel = require("./User");
const ProfileModel = require("./Profile");
const BusinessModel = require("./Business");
const BusinessCategoryModel = require("./BusinessCategory");
const ServiceModel = require("./Service");
const AppointmentModel = require("./Appointment");
const SubscriptionPlanModel = require("./SubscriptionPlan");
const UserSubscriptionModel = require("./UserSubscription");
const AdModel = require("./Ad");
const AdsLogModel = require("./AdsLog");

// MODEL INSTANCE'LARI
const User = UserModel(sequelize);
const Profile = ProfileModel(sequelize);
const Business = BusinessModel(sequelize);
const BusinessCategory = BusinessCategoryModel(sequelize);
const Service = ServiceModel(sequelize);
const Appointment = AppointmentModel(sequelize);
const SubscriptionPlan = SubscriptionPlanModel(sequelize);
const UserSubscription = UserSubscriptionModel(sequelize);
const Ad = AdModel(sequelize);
const AdsLog = AdsLogModel(sequelize);

/* ===========================
   İLİŞKİLER (TEK MERKEZ)
=========================== */

// USER
User.hasOne(Profile, { foreignKey: "user_id", onDelete: "CASCADE" });
Profile.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Business, { foreignKey: "owner_id" });
Business.belongsTo(User, { foreignKey: "owner_id" });

// BUSINESS
Business.belongsTo(BusinessCategory, { foreignKey: "category_id" });
BusinessCategory.hasMany(Business, { foreignKey: "category_id" });

Business.hasMany(Service, { foreignKey: "business_id" });
Service.belongsTo(Business, { foreignKey: "business_id" });

// APPOINTMENT
User.hasMany(Appointment, { foreignKey: "user_id" });
Appointment.belongsTo(User, { foreignKey: "user_id" });

Business.hasMany(Appointment, { foreignKey: "business_id" });
Appointment.belongsTo(Business, { foreignKey: "business_id" });

Service.hasMany(Appointment, { foreignKey: "service_id" });
Appointment.belongsTo(Service, { foreignKey: "service_id" });

// SUBSCRIPTION
User.hasMany(UserSubscription, { foreignKey: "user_id" });
UserSubscription.belongsTo(User, { foreignKey: "user_id" });

SubscriptionPlan.hasMany(UserSubscription, { foreignKey: "plan_id" });
UserSubscription.belongsTo(SubscriptionPlan, { foreignKey: "plan_id" });

// ADS
Business.hasMany(Ad, { foreignKey: "business_id" });
Ad.belongsTo(Business, { foreignKey: "business_id" });

Ad.hasMany(AdsLog, { foreignKey: "ad_id" });
AdsLog.belongsTo(Ad, { foreignKey: "ad_id" });

User.hasMany(AdsLog, { foreignKey: "user_id" });
AdsLog.belongsTo(User, { foreignKey: "user_id" });

/* ===========================
   EXPORT
=========================== */

module.exports = {
  sequelize,
  User,
  Profile,
  Business,
  BusinessCategory,
  Service,
  Appointment,
  SubscriptionPlan,
  UserSubscription,
  Ad,
  AdsLog
};
