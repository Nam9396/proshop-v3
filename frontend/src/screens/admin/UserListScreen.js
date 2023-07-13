import React from 'react'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { toast } from 'react-toastify'
import Loading from '../../components/Spinner.js'
import Message from '../../components/Message.js'
import { useDeleteUserByIdMutation, useGetAllUsersQuery } from '../../slices/usersApiSlice.js'

const UserListScreen = () => {
  const navigate = useNavigate();

  const { data: allUser, refetch, isLoading: loadingAllUser, error: errorAlluser } = useGetAllUsersQuery();
  const [ deleteUser, { isLoading: loadingDeleteUser } ] = useDeleteUserByIdMutation();

  const deleteUserHandler = async (id) => {
    try { 
      const userDeleted = await deleteUser(id).unwrap();
      if (userDeleted) { 
        toast.success('User deleted!');
        refetch();
      }
    } catch (err) { 
      toast.error(err?.data?.message || err.error);
    }
  }
  
  return (
    <>
      

      {loadingDeleteUser && <Loading />}
      {loadingAllUser ? (
        <Loading />
      ) : errorAlluser ? (
        <Message variant='danger'>{errorAlluser}</Message>
      ) : (
        <>
          <Table hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ADMIN</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {allUser.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{(user.isAdmin).toString()}</td>
                <td>
                  <LinkContainer
                    to={`/admin/user/${user._id}/edit`}
                  >
                    <Button variant='light' className='btn-sm mx-2'
                    >
                      <FaEdit />
                    </Button>
                  </LinkContainer>
                  <Button variant='danger' style={{color: 'white'}} className='btn-sm'
                    onClick={() => deleteUserHandler(user._id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>    
            ))}    
            </tbody>
          </Table>
        </>
      )}
    </>
  )
}

export default UserListScreen;