"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enumTsAstTpl_1 = __importDefault(require("../../template/enumTsAstTpl"));
const TSAnnotationMap_1 = require("../../constant/TSAnnotationMap");
const objDeepCopy_1 = require("../../utils/objDeepCopy");
const toCameCase_1 = require("../../utils/toCameCase");
const firstWordUpperCase_1 = require("../../utils/firstWordUpperCase");
const nameSpaceControl_1 = require("./nameSpaceControl");
const integrateTsAst_1 = require("./integrateTsAst");
const MarkDown_1 = require("../../constant/MarkDown");
/**
 * @description 生成一个枚举类型用于标示特定的参数类型
 * @param {ISingleEnumAst} 每一个需要枚举的信息
 * @param {function} 执行生成enum之后的回调，可在其中获取enumName
 */
exports.createEnum = (singleCell, enumCreated) => {
    const enumValues = singleCell.option.replace(/，/ig, ',').replace(/\s*/g, '').split(',');
    const members = [];
    let enumName = singleCell.rename || firstWordUpperCase_1.firstWordUpperCase(toCameCase_1.toCameCase(singleCell.currentName, '_'));
    enumName = nameSpaceControl_1.checkRepeatName(enumName);
    enumValues.forEach((value) => {
        const singleMember = objDeepCopy_1.objDeepCopy(enumTsAstTpl_1.default.declaration.members[0]);
        singleMember.id.name = toCameCase_1.toCameCase(value.split(MarkDown_1.ENUM_VALUE_DECOLLATOR)[0], '_');
        singleMember.initializer.type = TSAnnotationMap_1.EnumTypeAnnotations[MarkDown_1.MdToJsTypeMap[singleCell.type]];
        singleMember.initializer.value = value.split(MarkDown_1.ENUM_VALUE_DECOLLATOR)[1];
        members.push(singleMember);
    });
    integrateTsAst_1.collateEnumAst(enumName, members);
    if (enumCreated) {
        enumCreated(enumName);
    }
};
