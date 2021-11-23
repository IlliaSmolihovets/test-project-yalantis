import axios from "axios";

const GET_EMPLOYEES = "GET_EMPLOYEES"

const AC = {
    getEmployees(employees) {
        return ({type: GET_EMPLOYEES, payload: employees})
    },
};

export const getEmployees = () => {
    return (dispatch) => {
        axios.get('https://yalantis-react-school-api.yalantis.com/api/task0/users')
            .then(res => {
                dispatch(AC.getEmployees(res.data))
            })
    }
}

let initState = {
    employees: [],
};

const employeesReducer = (state = initState, action) => {
    switch (action.type) {
        case GET_EMPLOYEES: {
            return ({...state, employees: action.payload});
        }
        default:
            return state;

    }

}
export default employeesReducer;