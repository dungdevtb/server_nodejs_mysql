const { sequelize } = require("../config/connect");
const BaseModel = require("./BaseModel");
const { DataTypes } = require("sequelize");

class Order extends BaseModel {
  static association() {
    const Customer = require("./customer.model");
    this.belongsTo(Customer, {
      foreignKey: "customer_id",
      as: "customer",
    });

    const OrderProduct = require("./orderProduct.model");
    this.hasMany(OrderProduct, {
      foreignKey: 'order_id',
      sourceKey: 'id'
    });

    const Voucher = require("./voucher.model");
    this.belongsTo(Voucher, {
      foreignKey: 'voucher_id',
      sourceKey: 'id',
      as: 'voucher'
    })
  }
}

const attributes = {
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  order_code: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  delivery_type: {//loại vận chuyển: vân chuyển thường, vận chuyển hỏa tốc
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0
  },
  payment_type: {//loại thanh toán: thanh toán khi giao hàng, thanh toán online
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null,
    comment: 'payment_type : cash, online'
  },
  customer_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: true,
    defaultValue: null
  },
  voucher_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: true,
    defaultValue: null
  },
  fee_delivery: {
    type: DataTypes.FLOAT(7, 6),
    allowNull: true,
    defaultValue: null,
    comment: 'fee_delivery : fee delivery'
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null
  },
  status: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0,
    comment: '-1: Tạo đơn hàng,  0: Đang chờ xử lý(Chờ chủ Shop duyệt đơn hàng), 1: Đang giao hàng, 2: Đã giao hàng, 3: Đã hủy, 5: Thành công'
  },
  del: {
    type: DataTypes.TINYINT(1),
    allowNull: true,
    defaultValue: 0,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
};

const options = {
  tableName: "order",
};

Order.init(attributes, { ...options, sequelize });

module.exports = Order;
