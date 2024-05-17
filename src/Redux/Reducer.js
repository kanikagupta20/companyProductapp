import { MAKE_REQ, OPEN_POPUP, REQ_ADD_SUCC, REQ_DELETE_SUCC, REQ_GETALL_FAIL, REQ_GETALL_SUCC, REQ_GETBYCODE_SUCC, REQ_UPDATE_SUCC } from "./ActionType"

export const initialstate = {
    isloading: false,
    productlist: [],//comapnylist
    productobj: {},//companyobj
    errormessage: ''
}
// CompanyReducer
export const ProductReducer = (state = initialstate, action) => {
    switch (action.type) {
        case MAKE_REQ:
            return {
                ...state,
                isloading: true
            }
        case REQ_GETALL_SUCC:
            return {
                ...state,
                isloading: false,
                productlist: action.payload
            }
        case REQ_GETBYCODE_SUCC:
            return {
                ...state,
                productobj: action.payload
            }
        case REQ_GETALL_FAIL:
            return {
                ...state,
                isloading: false,
                productlist: [],
                errormessage: action.payload
            }
        case OPEN_POPUP:
            return {
                ...state,
                productobj: {}
            }
        case REQ_ADD_SUCC:
            const _inputdata = { ...action.payload };
            const _maxid = Math.max(...state.productlist.map(o => o.id));
            _inputdata.id = _maxid + 1;
            return {
                ...state,
                productlist: [...state.productlist, _inputdata]
            }
        case REQ_UPDATE_SUCC:
            const _data = { ...action.payload };
            const _finaldata = state.productlist.map(item => {
                return item.id === _data.id ? _data : item
            });
            return {
                ...state,
                productlist: _finaldata
            }
        case REQ_DELETE_SUCC:
            const _filterdata = state.productlist.filter((data) => {
                return data.id !== action.payload
            })
            return {
                ...state,
                productlist: _filterdata
            }
        default: return state;
    }
}