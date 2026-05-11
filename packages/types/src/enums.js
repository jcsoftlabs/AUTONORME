"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Locale = exports.ConversationChannel = exports.DeliveryType = exports.PaymentMethod = exports.OrderStatus = exports.PartCategory = exports.AppointmentStatus = exports.PartCondition = exports.ReminderStatus = exports.Role = void 0;
var Role;
(function (Role) {
    Role["CLIENT"] = "CLIENT";
    Role["GARAGE"] = "GARAGE";
    Role["SUPPLIER"] = "SUPPLIER";
    Role["ADMIN"] = "ADMIN";
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
})(Role || (exports.Role = Role = {}));
var ReminderStatus;
(function (ReminderStatus) {
    ReminderStatus["PENDING"] = "PENDING";
    ReminderStatus["SENT"] = "SENT";
    ReminderStatus["CONFIRMED"] = "CONFIRMED";
    ReminderStatus["SNOOZED"] = "SNOOZED";
    ReminderStatus["DONE"] = "DONE";
})(ReminderStatus || (exports.ReminderStatus = ReminderStatus = {}));
var PartCondition;
(function (PartCondition) {
    PartCondition["NEW"] = "NEW";
    PartCondition["USED"] = "USED";
    PartCondition["REFURBISHED"] = "REFURBISHED";
})(PartCondition || (exports.PartCondition = PartCondition = {}));
var AppointmentStatus;
(function (AppointmentStatus) {
    AppointmentStatus["PENDING"] = "PENDING";
    AppointmentStatus["CONFIRMED"] = "CONFIRMED";
    AppointmentStatus["CANCELLED"] = "CANCELLED";
    AppointmentStatus["COMPLETED"] = "COMPLETED";
})(AppointmentStatus || (exports.AppointmentStatus = AppointmentStatus = {}));
var PartCategory;
(function (PartCategory) {
    PartCategory["FREINAGE"] = "FREINAGE";
    PartCategory["MOTEUR"] = "MOTEUR";
    PartCategory["SUSPENSION"] = "SUSPENSION";
    PartCategory["ELECTRIQUE"] = "ELECTRIQUE";
    PartCategory["CARROSSERIE"] = "CARROSSERIE";
    PartCategory["AUTRE"] = "AUTRE";
})(PartCategory || (exports.PartCategory = PartCategory = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["CONFIRMED"] = "CONFIRMED";
    OrderStatus["PREPARED"] = "PREPARED";
    OrderStatus["SHIPPED"] = "SHIPPED";
    OrderStatus["DELIVERED"] = "DELIVERED";
    OrderStatus["CANCELLED"] = "CANCELLED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["MONCASH"] = "MONCASH";
    PaymentMethod["STRIPE"] = "STRIPE";
    PaymentMethod["VIREMENT"] = "VIREMENT";
    PaymentMethod["AUTOFIN"] = "AUTOFIN";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var DeliveryType;
(function (DeliveryType) {
    DeliveryType["GARAGE_PICKUP"] = "GARAGE_PICKUP";
    DeliveryType["HOME_DELIVERY"] = "HOME_DELIVERY";
})(DeliveryType || (exports.DeliveryType = DeliveryType = {}));
var ConversationChannel;
(function (ConversationChannel) {
    ConversationChannel["WEB"] = "WEB";
    ConversationChannel["MOBILE"] = "MOBILE";
    ConversationChannel["WHATSAPP"] = "WHATSAPP";
})(ConversationChannel || (exports.ConversationChannel = ConversationChannel = {}));
var Locale;
(function (Locale) {
    Locale["FR"] = "fr";
    Locale["HT"] = "ht";
    Locale["EN"] = "en";
})(Locale || (exports.Locale = Locale = {}));
//# sourceMappingURL=enums.js.map