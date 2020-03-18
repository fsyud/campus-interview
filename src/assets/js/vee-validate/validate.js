
import Vue from 'vue'
import VeeValidate, { Validator } from 'vee-validate'
import zh_CN from './zh_cn.js'
import VueI18n from 'vue-i18n'
import { Certificate } from 'crypto';

Vue.use(VueI18n)
const i18n = new VueI18n({
    locale: 'cn'
})
const config = {
    events: 'change',//change|input|custom
    fieldsBagName: 'fieldBags',
    i18n: i18n,
    delay: '100'
};
Vue.use(VeeValidate, config);
//自定义验证语言
const dictionary = {
    cn: {
        messages: zh_CN
    }
};
Validator.localize(dictionary);
Validator.localize('cn');
// //自定义验证规则
Validator.extend('emailhtmlrequired', {
    getMessage: field => '这是必填项 ',
    validate: value => {
        return value.length != 0 && value.trim() !== "<br>" && value.trim() !== "<br/>"
    }
});
Validator.extend('usernamepasswordrequired', {
    getMessage: field => '账号密码不能为空，请重新输入 ',
    validate: value => {
        return value.length != 0
    }
});
Validator.extend('coderequired', {
    getMessage: field => '验证码不能为空，请输入验证码 ',
    validate: value => {
        return value.length != 0
    }
});
Validator.extend('emailvalidate', {
    getMessage: field => '邮箱地址有误 ',
    validate: value => {
        var email = value.split(";");
        for (let index in email) {
            var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            // myreg.test(email[index]);
            console.log(myreg.test(email[index]));

            if (!myreg.test(email[index]) && email[index] != "") {
                return false
            }

        }
        return true;
    }
});
Validator.extend('isComlaineeChecked', {
    getMessage: field => '投诉责任人为必填项',
    validate: (input, checkArray) => {
        return (checkArray[0] || checkArray[1] || checkArray[2])
    }
});
Validator.extend('oneFieldFilledValidate', {
    getMessage: field => '该组信息至少填写一项的值',
    validate: (input, checkArray) => {
        var isAllFieldEmpty = true;
        checkArray.forEach(item => isAllFieldEmpty = item.length == 0 ? isAllFieldEmpty : false)
        return !isAllFieldEmpty
    }
});

// Validator.extend('vcode', {
//     getMessage: field => '请输入正确的验证码',
//     validate: value => {
//         return value.length === 4 && /^\d{4}$/.test(value) || value == 'vcodeouttime'
//     }
// });
// Validator.extend('outtime', {
//     getMessage: field => '验证码已过期，请输入新的验证码',
//     validate: value => {
//         return value != 'vcodeouttime'
//     }
// });
// Validator.extend('smscode', {
//     getMessage: field => '请输入正确的短信验证码',
//     validate: value => {
//         return value.length === 6 && /^\d{6}$/.test(value)
//     }
// });
// Validator.extend('isidcard', {
//     getMessage: field => '请输入正确的证件号码',
//     validate: (idcard, certification) => {
//         if (certification == '0') {//身份证
//             return /^[1-9][0-9]{5}[1-2][0-9]{3}(((0[1|3|5|7|8]|1[0|2])(0[1-9]|[1-2][0-9]|3[0-1]))|((0[4|6|9]|11)(0[1-9]|[1-2][0-9]|30))|(02(0[1-9]|[1-2][0-9])))[0-9]{3}([0-9]|X|x)$/.test(idcard)
//         }
//         return true
//     }
// });
// Validator.extend('isBirthToIDCard', {
//     getMessage: field => '请与您证件上的号码保持一致',
//     validate: (birthday, paramsObj) => {
//         var cardNum, certification;
//         cardNum = paramsObj[0].cardNum;
//         certification = paramsObj[0].certification;
//         if (certification == '0') {
//             birthday = formatDate(birthday);
//             if (birthday != cardNum.substring(6, 10) + "-" + cardNum.substring(10, 12) + "-" + cardNum.substring(12, 14)) {//身份证
//                 return false
//             }
//             else {
//                 return true
//             }
//         }
//         else {
//             return true;
//         }

//     }
// });
// var padDate = function (value) {
//     return value < 10 ? '0' + value : value;
// }
// var formatDate = function (value) {
//     var date = new Date(value);
//     var year = date.getFullYear();
//     var month = padDate(date.getMonth() + 1);
//     var day = padDate(date.getDate());
//     return year + '-' + month + '-' + day;
// }
// Validator.extend('isContactMobileValidate', {
//     getMessage: field => '紧急联系人电话不能与您的手机号码相同',
//     validate: (phonenumber1, phonenumber2) => {
//         if (phonenumber1 == phonenumber2) {
//             return false;
//         }
//         else {
//             return true;
//         }
//     }
// });

export default {
    data() {
        return {}
    },
    VeeValidate
}
