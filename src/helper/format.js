const dvBlock = '1 nghìn triệu tỷ'.split(' ');

const defaultNumbers = ' hai ba bốn năm sáu bảy tám chín';

const chuHangDonVi = ('1 một' + defaultNumbers).split(' ');
const chuHangChuc = ('lẻ mười' + defaultNumbers).split(' ');
const chuHangTram = ('không một' + defaultNumbers).split(' ');

class format {
    //Format số theo VNĐ
    static vnd(number) {
        if (isNaN(Number(number))) {
            return 'NaN';
        }
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(number);
    }
    //Format số theo USD
    static usd(number) {
        if (isNaN(Number(number))) {
            return 'NaN';
        }
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(number);
    }

    //Số nguyên
    static int(number) {
        if (isNaN(Number(number))) {
            return 'NaN';
        }
        return new Intl.NumberFormat('vi-VN', {
            useGrouping: true,
            maximumFractionDigits: 0
        }).format(number);
    }

    // số thập phân (mặc định 3 số ở đuôi)
    static decimal(number, decimalPlaces = 3) {
        if (isNaN(Number(number))) {
            return 'NaN';
        }
        return new Intl.NumberFormat('vi-VN', {
            useGrouping: true,
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces
        }).format(number);
    }

    //chuyển số thành chữ theo vnd
    static numToVietnamese(number) {
        if (isNaN(Number(number))) {
            return 'NaN';
        }
        const str = String(parseInt(number) || 0);

        if (!str || str === 'NaN' || str === '0') {
            return '';
        }

        const arr = [];
        let index = str.length;

        // Chia chuỗi số thành một mảng từng khối có 3 chữ số
        while (index > 0) {
            arr.push(str.substring(Math.max(index - 3, 0), index));
            index -= 3;
        }

        // Đảo ngược mảng để xử lý từ hàng đơn vị lên
        arr.reverse();

        const result = [];

        // Lặp từng khối trong mảng và convert từng khối đấy ra chữ Việt Nam
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] && arr[i] !== '000') {
                // Hàm convertBlockThree được đưa vào đây
                let blockResult = '';
                const block = arr[i];

                if (block === '000') {
                    blockResult = '';
                } else {
                    const _a = String(block);

                    switch (_a.length) {
                        case 1:
                            blockResult = chuHangDonVi[_a];
                            break;
                        case 2:
                            // Hàm convertBlockTwo được đưa vào đây
                            const number = _a;
                            const chuc = chuHangChuc[number[0]];
                            let dv = chuHangDonVi[number[1]];
                            let append = '';

                            // Nếu số hàng chục lớn hơn 1
                            if (number[0] > 1) {
                                append = ' mươi';

                                // Nếu số hàng đơn vị là 1
                                if (number[1] === '1') {
                                    dv = ' mốt';
                                }
                                // Nếu số hàng đơn vị là 5
                                else if (number[1] === '5') {
                                    dv = 'lăm';
                                }
                            }
                            // Nếu số hàng chục là 1 và hàng đơn vị là 5
                            else if (number[0] === '1' && number[1] === '5') {
                                dv = 'lăm';
                            }

                            blockResult = chuc + append + (dv ? ' ' + dv : '');
                            break;
                        case 3: {
                            // Xử lý số hàng trăm
                            const tram = chuHangTram[_a[0]] + ' trăm';

                            // Xử lý số hàng chục và đơn vị
                            let chuc_dv = '';
                            if (_a.slice(1, 3) !== '00') {
                                const number = _a.slice(1, 3);
                                const chuc = chuHangChuc[number[0]];
                                let dv = chuHangDonVi[number[1]];
                                let append = '';

                                // Nếu số hàng chục lớn hơn 1
                                if (number[0] > 1) {
                                    append = ' mươi';

                                    // Nếu số hàng đơn vị là 1
                                    if (number[1] === '1') {
                                        dv = ' mốt';
                                    }
                                    // Nếu số hàng đơn vị là 5
                                    else if (number[1] === '5') {
                                        dv = 'lăm';
                                    }
                                }
                                // Nếu số hàng chục là 1 và hàng đơn vị là 5
                                else if (number[0] === '1' && number[1] === '5') {
                                    dv = 'lăm';
                                }

                                chuc_dv = chuc + append + (dv ? ' ' + dv : '');
                            }

                            blockResult = tram + (chuc_dv ? ' ' + chuc_dv : '');
                            break;
                        }
                        default:
                            blockResult = '';
                    }
                }

                result.push(blockResult);

                // Thêm đuôi của mỗi khối
                if (dvBlock[i]) {
                    result.push(dvBlock[i]);
                }
            }
        }

        // Xóa những ký tự thừa và viết hoa chữ cái đầu
        return result
            .join(' ')
            .replace(/[0-9]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .replace(/^[a-zàáạảãâầấậẩẫăằắặẳẵ]/, (letter) => letter.toUpperCase());
    }

    //Format ngày
    static date(value) {
        if (!value || isNaN(new Date(value).getTime())) {
            return '--';
        }
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(new Date(value));
    }

    //Format ngày giờ
    static dateTime(value) {
        if (!value || isNaN(new Date(value).getTime())) {
            return '--';
        }
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(new Date(value));
    }

    //Format giờ
    static time(value) {
        if (!value || isNaN(new Date(value).getTime())) {
            return '--';
        }
        return new Intl.DateTimeFormat('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
            // second: '2-digit'
        }).format(new Date(value));
    }
}

export default format;
