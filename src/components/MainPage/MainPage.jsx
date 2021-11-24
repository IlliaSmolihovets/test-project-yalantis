import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getEmployees } from "../../redux/employeesReducer"
import "./MainPage.css"

const BirthdayEmployees = (props) => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    let currentDate = new Date();
    for (let i = 0; i < currentDate.getMonth(); i++) {
        monthNames.push(monthNames[0]);
        monthNames.shift();
    }

    let activeEmployees = [];
    activeEmployees = props.activeEmployeesId.map(item => {
        let tempObj;
        props.employees.forEach(obj => {
            if (obj.id === item) {
                tempObj = obj;
            }
        });
        return tempObj;
    });

    let renderMonth = monthNames.map((month, index) => {
        let sortedActivEmployees = activeEmployees.map(item => {
            let monthOfBirthday = Number(item.dob.slice(5, 7));
            // console.log(monthOfBirthday)
            if (monthOfBirthday === (index + currentDate.getMonth()) ||
                monthOfBirthday === (index + currentDate.getMonth() - 12)) {
                return (
                    <div key={item.id}>
                        {item.firstName} {item.lastName}
                    </div>
                )
            }
            else return undefined;
        })

        return (
            <div key={index}>
                <div className="mouth">{month}</div>
                <div>{sortedActivEmployees}</div>
            </div>
        )
    })

    return (
        <div className="birthday-list">{renderMonth}</div>
    )
}

const Employee = (props) => {
    const { id, firstName, lastName } = props.employee;
    const update = props.update;
    const [isActive, setIsActive] = useState(props.isActive);

    let checkingEmployee = () => {
        setIsActive(!isActive);
        update(id);
    }

    return (
        <div>
            <div className="full-name">{firstName} {lastName}</div>
            <form className="user-item">
                <input type="radio" name={id} value="active" onChange={checkingEmployee} checked={isActive} />
                <div>active</div>
                <input type="radio" name={id} value="non-active" onChange={checkingEmployee} checked={!isActive} />
                <div>not active</div>
            </form>
        </div>
    )
}

const EmployeesList = (props) => {
    let employeesMarkup = props.employees.map(employee => {
        let isActive = false;
        props.activeEmployeesId.forEach(element => {
            if (element === employee.id) {
                isActive = true;
            }
        });
        return (
            <div key={employee.id}>
                <Employee employee={employee} update={props.update} isActive={isActive} />
            </div>
        )
    })
    return (
        <div>
            <div>{props.letter}</div>
            {props.employees.length > 0 ? employeesMarkup : <div className="full-name">No employee</div>}
        </div>
    )
}

const MainPage = () => {
    const dispatch = useDispatch();
    const employees = useSelector((state) => state.employeesRed.employees);
    const [activeEmployeesId, setactiveEmployeesId] = useState([]);

    const updateLocalStorage = (id) => {
        const storage = [...activeEmployeesId];
        const activeId = storage.findIndex(item => id === item)
        if (activeId >= 0) {
            storage.splice(activeId, 1);
        }
        else {
            storage.push(id);
        }
        setactiveEmployeesId(storage);
    }

    useEffect(() => {
        window.localStorage.setItem('active-employees', JSON.stringify(activeEmployeesId))
        // console.log(activeEmployeesId)
        // console.log(JSON.parse(window.localStorage.getItem('active-employees')))
    }, [activeEmployeesId])

    useEffect(() => {
        dispatch(getEmployees());
        setactiveEmployeesId(JSON.parse(window.localStorage.getItem('active-employees')));
        // console.log(JSON.parse(window.localStorage.getItem('active-employees')))
    }, []);

    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    let sortingEmployees = alphabet.split("").map((item) => {
        let lettersFilter = employees.filter(name => {
            return name.firstName.substring(0, 1) === item;
        })
        return (
            <div className="employee-list-content" key={item}>
                <EmployeesList employees={lettersFilter} update={updateLocalStorage} activeEmployeesId={activeEmployeesId} letter={item} />
            </div>
        )
    })

    return (
        <div className="main-wrapper">
            <div className="employee-list">{sortingEmployees}</div>
            <BirthdayEmployees activeEmployeesId={activeEmployeesId} employees={employees} />
        </div>
    )
}

export default MainPage;