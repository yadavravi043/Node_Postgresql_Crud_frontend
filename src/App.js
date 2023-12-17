import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Table, Modal, Input, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

function App() {
  const [user, setUser] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isFormVisible, setFormVisible] = useState(false);
  const [name, setName] = useState();
  const [phone, setPhone] = useState();
  useEffect(() => {
    fetchUserData();
  }, []);

  const handleButtonClick = () => {
    setFormVisible(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    const data = axios
      .post("https://node-postgresql-crus-server.onrender.com/user/createuser", { name, phone })
      .then((response) => {
        console.log(`User created successfully`);
      })
      .catch((err) => {
        console.log(`Error occured while creating users`);
      });
  };
  const onDeleteUser = async (record) => {
    Modal.confirm({
      title: "Are you sure, to delete this user record ?",
      okText: "Yes",
      okType: "danger",
      onOk: async () => {
        //  setUser((pre)=>{
        //      return pre.filter((user)=>user.id!==record.id);
        //  })
        const userId = record.id;
        console.log("fro id", userId);
        await axios
          .post("https://node-postgresql-crus-server.onrender.com/user/deleteuser", { userId })
          .then((response) => {
            console.log(`User deleted successfully`);
          })
          .catch((err) => {
            console.log(`Error occured while deleting users`);
          });
      },
    });
  };
  const onEditUser = (record) => {
    setIsEditing(true);
    setEditingStudent({ ...record });
  };
  const resetEditing=()=>{
    setIsEditing(false)
    setEditingStudent(null)
 }
  const columns = [
    {
      key: "1",
      title: "Id",
      dataIndex: "id",
    },
    {
      key: "2",
      title: "Name",
      dataIndex: "name",
      sorter:(record1,record2)=>{
        return  record1.name >record2.name
        }
    },
    {
      key: "3",
      title: "Phone",
      dataIndex: "phone",
    },
    {
      key: "3",
      title: "Actions",
      render: (record) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditUser(record);
              }}
            />
            <DeleteOutlined
              style={{ color: "red", margin: "20px" }}
              onClick={() => {
                onDeleteUser(record);
              }}
            />
          </>
        );
      },
    },
  ];

  const fetchUserData = async () => {
    const data = await axios
      .get("https://node-postgresql-crus-server.onrender.com/user/users")
      .then((response) => {
        console.log("data", response.data.user);
        const alluser = response.data.user;
        setUser(alluser);
      })
      .catch((err) => {
        console.log(`Error occured while fetching users`);
      });
  };

  return (
    <>
      <h1>Users Lists</h1>



      <Table
        dataSource={user}
        columns={columns}
        // pagination={{
        //     total:500, //page by page
        //     current:page,
        //     pageSize:pageSize,
        //     onChange:(page,pageSize)=>{
        //         setPage(page);
        //         setPageSize(pageSize)
        //     }
        //   }}
      ></Table>



      <Modal
        title="Edit User"
        okText="Save"
        visible={isEditing}
        onCancel={() => {
          resetEditing();
        }}
        onOk={ async () => {
          // setUser((pre) => {
          //   return pre.map((user) => {
          //     if (user.id === editingStudent.id) {
          //       return editingStudent;
          //     } else {
          //       return user;
          //     }
          //   });
          // });
    
          const id=editingStudent.id;
          const name=editingStudent.name;
          const phone=editingStudent.phone;

        await axios
          .post("https://node-postgresql-crus-server.onrender.com/user/updateuser", {id,name,phone })
          .then((response) => {
            console.log(`User edited successfully`);
          })
          .catch((err) => {
            console.log(`Error occured while editing users`);
          });
          resetEditing();
        }}
      >
        <Input
          value={editingStudent?.name}
          onChange={(e) => {
            setEditingStudent((pre) => {
              return { ...pre, name: e.target.value };
            });
          }}
        />
        <Input
          value={editingStudent?.phone}
          onChange={(e) => {
            setEditingStudent((pre) => {
              return { ...pre, phone: e.target.value };
            });
          }}
        />
      </Modal>



      <button onClick={handleButtonClick}>Create New User</button>
      {isFormVisible && (
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              required
              placeholder="enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <br />
          <label>
            Phone:
            <input
              type="phone"
              required
              name="phone"
              value={phone}
              placeholder="enter phone"
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>
          <br />
          <button type="submit">Submit</button>
        </form>
      )}
    </>
  );
}

export default App;
