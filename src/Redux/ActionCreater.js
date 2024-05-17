import axios from "axios";
import { AddRequest, RemoveRequest, UpdateRequest, getAllRequestFail, getAllRequestSuccess, getbycodeSuccess, makeRequest } from "./Action"
import { toast } from "react-toastify";
//GetAllCompanys
export const GetAllProducts = () => {
    return (dispatch) => {
        dispatch(makeRequest());
        setTimeout(()=>{
            axios.get("http://localhost:8000/companyProducts").then(res => {
                const _list = res.data;
                dispatch(getAllRequestSuccess(_list));
            }).catch(err => {
                dispatch(getAllRequestFail(err.message));
            });
        },500)
       
    }
}
// GetCompanybycode
export const GetProductbycode = (code) => {
    return (dispatch) => {
        //dispatch(makeRequest());
        axios.get("http://localhost:8000/companyProducts/"+code).then(res => {
            const _obj = res.data;
            dispatch(getbycodeSuccess(_obj));
        }).catch(err => {
            toast.error('Failed to fetch the data')
        });
    }
}
//CreateCompany
export const CreateProduct = (data) => {
    return (dispatch) => {
        axios.post("http://localhost:8000/companyProducts", data).then(res => {
            dispatch(AddRequest(data));
            toast.success('product created successfully.')
        }).catch(err => {
            toast.error('Failed to create product due to :' + err.message)
        });
    }
}
//UpdateCompany
export const UpdateProduct = (data) => {
    return (dispatch) => {
        axios.put("http://localhost:8000/companyProducts/"+data.id, data).then(res => {
            dispatch(UpdateRequest(data));
            toast.success('product updated successfully.')
        }).catch(err => {
            toast.error('Failed to update product due to :' + err.message)
        });
    }
}

//RemoveCompany
export const RemoveProduct = (code) => {
    return (dispatch) => {
        axios.delete("http://localhost:8000/companyProducts/"+code).then(res => {
            dispatch(RemoveRequest(code));
            toast.success('Product Removed successfully.')
        }).catch(err => {
            toast.error('Failed to remove product due to :' + err.message)
        });
    }
}


