const asyncHandler = require("express-async-handler");
const { Customer } = require("../model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _CONF = require("../config/auth.config");
const { checkPassword, hashPassWord, generateToken } = require("../middleware/auth");
const { Paging } = require("../config/paging");
const { Op } = require("sequelize");
const { ERROR_MESSAGE } = require("../config/error");
const excelJS = require("exceljs")
require("dotenv").config();

const register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All feilds are mandatory!");
    }

    //check user tồn tại qua trường email vì email là duy nhất
    const userAvailable = await Customer.findOne({
        where: {
            email: email,
        },
    });
    if (userAvailable) {
        res.status(400);
        throw new Error("User has registered for this email!");
    }

    //register: Tạo User ms
    //hashPassword
    const hashPassword = await bcrypt.hash(password, 10);
    // console.log("Password then hash ===>", hashPassword);
    const user = await Customer.create({
        username: username,
        email: email,
        password: hashPassword,
        status: 1,
    });

    return {
        message: "Register successfully!",
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
        }
    };
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("All feilds are mandatory");
    }

    const user = await Customer.findOne({
        where: {
            email: email,
            del: 0
        },
        attributes: {
            exclude: ['del', 'createdAt', 'updatedAt']
        },
    });

    if (!user) {
        throw new Error(ERROR_MESSAGE.NOT_FOUND_ACCOUNT);
    }

    if (user.status === 0) {
        throw new Error(ERROR_MESSAGE.NOT_ACTIVE_ACCOUNT);
    }

    ////compare password vs hashPassWord
    //so sánh pass ng dung nhập vs hashPass trong db
    if (user && (await bcrypt.compare(password, user.password))) {
        //jwt gồm :<base64-encoded header>.<base64-encoded payload>.<base64-encoded signature>

        //jwt.sign(payload, secretOrPrivateKey, [options, callback])
        const accessToken = jwt.sign(
            {
                //truyền vào payload
                userid: user.id
                // user: {
                //   username: user.username,
                //   email: user.email,
                //   id: user.id,
                // },
            },
            _CONF.SECRET,
            { expiresIn: _CONF.tokenLife } //token sẽ hết hạn 
        );
        const refreshToken = jwt.sign(
            {
                //truyền vào payload
                userid: user.id
                // user: {
                //   username: user.username,
                //   email: user.email,
                //   id: user.id,
                // },
            },
            _CONF.SECRET_REFRESH,
            { expiresIn: _CONF.refreshTokenLife }
        );



        return {
            token: accessToken,
            refreshToken: refreshToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                mobile: user.mobile,
                address: user.address,
                status: user.status,
                avatar: user.avatar,
            },
        };
    } else {
        return {
            status: 401,
            message: "Email or password is not valid",
        };
    }
});

const getListCustomer = asyncHandler(async (req, res) => {
    const paging = Paging(req.page, req.limit);
    let where = {
        del: 0
    }

    if (req.name && req.name !== "") {
        where.username = {
            [Op.like]: `%${req.name}%`
        }
    }

    if (req.email && req.email !== "") {
        where.email = {
            [Op.like]: `%${req.email}%`
        }
    }

    const users = await Customer.findAll({
        where: {
            ...where
        },
        attributes: {
            exclude: ['password', 'del', 'createdAt', 'updatedAt']
        },
        ...paging,
        order: [['createdAt', 'desc']],
    });

    const total = await Customer.count({
        where: {
            ...where
        }
    })

    return {
        rows: users,
        total: total
    }
})

const updateCustomer = async (req, res) => {
    const check = await Customer.findOne({
        where: {
            id: data.id,
            del: 0
        }
    })

    if (!check) {
        throw new Error("User not found!")
    }

    const checkEmail = await Customer.findOne({
        where: {
            id: {
                [Op.notLike]: data.id
            },
            email: {
                [Op.like]: `%${data.email}%`
            },
            del: 0
        }
    })

    if (checkEmail) {
        throw new Error('Email already exists')
    }

    if (data.password && data.password != '') {
        data.password = hashPassWord(data.password)
    }

    const update = await check.update({ ...data })
    return update
}

const deleteCustomer = async (id) => {
    const check = await Customer.findOne({
        where: {
            id: id,
            del: 0
        }
    })

    if (!check) {
        throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND);
    }

    return check.update({ del: 1 });
}

const exportListCustomer = async (req, res) => {
    try {
        let where = {
            del: 0
        }

        if (req.name && req.name !== "") {
            where.username = {
                [Op.like]: `%${req.name}%`
            }
        }

        if (req.email && req.email !== "") {
            where.email = {
                [Op.like]: `%${req.email}%`
            }
        }

        const users = await Customer.findAll({
            where: {
                ...where
            },
            attributes: {
                exclude: ['password', 'del', 'createdAt', 'updatedAt']
            },
            order: [['createdAt', 'desc']],
        });

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet('Users');
        const name_file = 'customer'
        // tạo một sheet nơi các đường lưới bị ẩn
        // worksheet.views = [{
        //   showGridLines: false
        // }]

        //thêm cột 
        worksheet.columns = [
            { header: 'STT', key: 'stt', width: 10, style: { alignment: { horizontal: 'center', vertical: 'middle' } } },
            { header: 'Tên người dùng', key: 'username', width: 30, style: { alignment: { horizontal: 'center', vertical: 'middle' } } },
            { header: 'Email', key: 'email', width: 30, style: { alignment: { horizontal: 'center', vertical: 'middle' } } },
            { header: 'Số điện thoại', key: 'mobile', width: 30, style: { alignment: { horizontal: 'center', vertical: 'middle' } } },
            { header: 'Địa chỉ', key: 'address', width: 30, style: { alignment: { horizontal: 'center', vertical: 'middle' } } },
            { header: 'Trạng thái', key: 'status', width: 20, style: { alignment: { horizontal: 'center', vertical: 'middle' } } },
        ];

        // đọc dữ liệu
        let length = 1
        users.map((user, index) => {
            worksheet.addRow({
                stt: index + 1,
                username: user.username ? user.username : '',
                email: user.email ? user.email : '',
                mobile: user.mobile ? user.mobile.replace(user.mobile.charAt(0), "+84") : '',
                address: user.address ? user.address : '',
                status: user.status == 1 ? "Hoạt động" : "Không hoạt động",
            });
            length += 1
        })

        worksheet.insertRow(1, {})
        worksheet.insertRow(1, {})
        worksheet.insertRow(1, {})
        worksheet.insertRow(1, {})
        worksheet.mergeCells(1, 1, 1, worksheet.columns.length)
        worksheet.mergeCells(2, 1, 2, worksheet.columns.length)
        worksheet.mergeCells(3, 1, 3, worksheet.columns.length)
        worksheet.mergeCells(4, 1, 4, worksheet.columns.length)

        //designn header file
        worksheet.getCell('A1').value = 'DỰ ÁN QUẢN LÝ BÁN HÀNG - LẠI THẾ DŨNG'
        worksheet.getCell('A1').font = {
            size: 14,
            bold: true,
            color: { argb: 'FF0000' }
        }
        worksheet.getCell('A1').alignment = { horizontal: 'left', vertical: 'middle' };

        worksheet.getCell('A2').value = 'BẢNG QUẢN LÝ KHÁCH HÀNG';
        worksheet.getCell('A2').font = {
            size: 18,
            bold: true,
        };
        worksheet.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };

        worksheet.getCell('A3').value = 'Từ trước đến nay';
        worksheet.getCell('A3').font = {
            size: 11,
            bold: true,
            color: { argb: 'FF0000' },
        };
        worksheet.getCell('A3').alignment = { horizontal: 'center', vertical: 'middle' };

        worksheet.getRow(5).eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
            cell.border = {
                top: { style: 'thin', color: { argb: '00000000' } },
                left: { style: 'thin', color: { argb: '00000000' } },
                bottom: { style: 'thin', color: { argb: '00000000' } },
                right: { style: 'thin', color: { argb: '00000000' } }
            }
        });

        users.map((user, index) => {
            worksheet.getRow(6 + index).eachCell((cell) => {
                cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
                cell.border = {
                    top: { style: 'thin', color: { argb: '00000000' } },
                    left: { style: 'thin', color: { argb: '00000000' } },
                    bottom: { style: 'thin', color: { argb: '00000000' } },
                    right: { style: 'thin', color: { argb: '00000000' } }
                }
            });
        })

        const rows = worksheet.getRows(5, length);
        rows.map((row, i) => {
            worksheet.getRow(5 + i).height = 20
        })

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', `attachment; filename=${name_file}.xlsx`);

        return workbook.xlsx.write(res).then(() => {
            res.status(200);
        });
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    register,
    login,
    getListCustomer,
    updateCustomer,
    deleteCustomer,
    exportListCustomer
}