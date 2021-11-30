import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getEmployees } from "../../redux/employeesReducer"
import "./MainPage.css"

const Employee = (props) => {
    const { id, firstName, lastName } = props.employee;
    const update = props.update;
    const [isActive, setIsActive] = useState(false);

    let checkingEmployee = (event) => {
        setIsActive(!isActive);
        update(id);
    }

    return (
        <div>
            <div>{firstName} {lastName}</div>
            <form>
                <input type="radio" name={id} value="active" onChange={checkingEmployee} checked={isActive} />
                <input type="radio" name={id} value="non-active" onChange={checkingEmployee} checked={!isActive} />
            </form>
        </div>
    )
}

const EmployeesList = (props) => {
    let employeesMarkup = props.employees.map(employee => {
        return (
            <Employee employee={employee} update={props.update} />
        )
    })
    return (
        <div>{employeesMarkup}</div>
    )
}

const MainPage = () => {
    const dispatch = useDispatch();
    const employees = useSelector((state) => state.employeesRed.employees);
    const [activeEmployees, setActiveEmployees] = useState([]);

    const updateLocalStorage = (id) => {
        const storage = [...activeEmployees];
        const activeId = storage.findIndex(item => id === item)
        if (activeId >= 0) {
            storage.splice(activeId, 1);
        }
        else {
            storage.push(id);
        }
        setActiveEmployees(storage);
    }

    useEffect(() => {
        window.localStorage.setItem('active-employees', JSON.stringify(activeEmployees))
        console.log(activeEmployees)
        console.log(JSON.parse(window.localStorage.getItem('active-employees')))
    }, [activeEmployees])

    useEffect(() => {
        dispatch(getEmployees());
        setActiveEmployees(JSON.parse(window.localStorage.getItem('active-employees')));
        console.log(JSON.parse(window.localStorage.getItem('active-employees')))
    }, []);

    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    let sortingEmployees = alphabet.split("").map((item) => {
        let lettersFilter = employees.filter(name => {
            return name.firstName.substring(0, 1) === item;
        })
        return (
            <div>
                <p>{item}</p>
                <EmployeesList employees={lettersFilter} update={updateLocalStorage} />
            </div>
        )
    })

    return (
        <div>{sortingEmployees}</div>
    )
}

export default MainPage;