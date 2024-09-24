const { Op } = require("sequelize");
const { ERROR_MESSAGE } = require("../config/error");
const { Paging } = require("../config/paging");
const { Guitar } = require("../model");
const { formatMoney } = require("../config/common");
const excelJS = require("exceljs")

const getListGuitar = async (req) => {
    let where = {
        del: 0
    }

    const { page, limit, name } = req

    let paging = Paging(page, limit)

    if (name) {
        where = {
            ...where,
            name: {
                [Op.like]: `${name.trim()}`
            }
        }
    }

    const res = await Guitar.findAll({
        where: {
            ...where
        },
        paging,
        attributes: {
            exclude: ['del', 'createdAt', 'updatedAt']
        },
        order: [["createdAt", "desc"]],
    })

    const count = await Guitar.count({
        where: {
            ...where
        }
    })

    return {
        rows: res,
        total: count
    }
}

const createUpdateGuitar = async (req) => {
    if (req.id) {
        const guitar = await Guitar.findOne({
            where: {
                id: req.id,
                del: 0
            }
        })
        if (!guitar) {
            throw ERROR_MESSAGE.NOT_FOUND
        }
        return await guitar.update(req)
    } else {
        return await Guitar.create(req)
    }
}

const deleteGuitar = async (id) => {
    const guitar = await Guitar.findOne({
        where: {
            id: id,
            del: 0
        }
    })
    if (!guitar) {
        throw ERROR_MESSAGE.NOT_FOUND
    }

    // const ok= await guitar.update({ del: 1 })
    return await guitar.update({ del: 1 })
}

const exportListGuitar = async (req, res) => {
    try {
        let where = {
            del: 0
        }

        const { page, limit, name } = req

        let paging = Paging(page, limit)

        if (name) {
            where = {
                ...where,
                name: {
                    [Op.like]: `${name.trim()}`
                }
            }
        }

        const guitarList = await Guitar.findAll({
            where: {
                ...where
            },
            paging,
            attributes: {
                exclude: ['del', 'createdAt', 'updatedAt']
            },
            order: [["createdAt", "desc"]],
        })

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet('GuitarList');
        const name_file = 'guitar'
        // tạo một sheet nơi các đường lưới bị ẩn
        // worksheet.views = [{
        //   showGridLines: false
        // }]

        //thêm cột 
        worksheet.columns = [
            { header: 'STT', key: 'stt', width: 10, style: { alignment: { horizontal: 'center', vertical: 'middle' } } },
            // { header: 'Hình ảnh', key: 'image', width: 30 }, // Thêm cột hình ảnh
            { header: 'Tên guitar', key: 'name', width: 30, style: { alignment: { horizontal: 'center', vertical: 'middle' } } },
            { header: 'Giá guitar', key: 'price', width: 30, style: { alignment: { horizontal: 'center', vertical: 'middle' } } },
            { header: 'Mô tả', key: 'description', width: 30, style: { alignment: { horizontal: 'center', vertical: 'middle' } } },
        ];

        // đọc dữ liệu
        let length = 1
        guitarList.map((guitar, index) => {
            worksheet.addRow({
                stt: index + 1,
                name: guitar.name ? guitar.name : '',
                price: guitar.price ? formatMoney(guitar.price) + " vnd" : '',
                description: guitar.description ? guitar.description : '',
            });

            // Chèn hình ảnh (nếu có)
            // if (guitar.image) {
            //     const imageId = workbook.addImage({
            //         filename: guitar.image, // Đường dẫn tới file ảnh
            //         extension: 'png', // hoặc 'jpeg', tùy vào định dạng hình ảnh
            //     });

            //     // Chèn hình ảnh vào dòng mới tạo, cột B (cột thứ 2)
            //     worksheet.addImage(imageId, {
            //         tl: { col: 1, row: length - 1 }, // Chỉ định vị trí bắt đầu của hình ảnh (cột 1 là cột B sau STT)
            //         ext: { width: 100, height: 100 }, // Kích thước ảnh (điều chỉnh để vừa phải)
            //     });
            // }

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

        worksheet.getCell('A2').value = 'DANH SÁCH GUITAR';
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

        guitarList.map((guitar, index) => {
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
    getListGuitar,
    createUpdateGuitar,
    deleteGuitar,
    exportListGuitar
}



