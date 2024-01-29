import { useState, useEffect} from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { Form, Button, FormGroup } from 'react-bootstrap'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { toast } from 'react-toastify'
import { useUpdateUserMutation, useGetUserDetailsQuery } from '../slices/usersApiSlice'
import Loader from '../components/Loader'


const UserEditScreen = () => {
    const { id: userId } = useParams()

    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)

    const { data: user, isLoading, refetch, error} = useGetUserDetailsQuery(userId)
    const [updateUser, { isLoading: loadingUpdate}] = useUpdateUserMutation()
    
    useEffect(() => {
        if(user){
            setName(user.name)
            setEmail(user.email)
            setIsAdmin(user.isAdmin)
        }
    }, [user])

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            console.log(userId, name, email, isAdmin)
            await updateUser({ userId, name, email, isAdmin })
            toast.success('User details updated')
            refetch()
            navigate('/admin/userlist')
        } catch (error) {
            toast.error(error?.data?.message || error.error)
        }
    }

    
  return (
    <>
        <Link to='/admin/userlist' className='btn btn-light my-3'>
            Go Back
        </Link>
        <FormContainer>
        <h1>Edit User</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error.data.message}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name' className='my-2'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='email' className='my-2'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='isAdmin' className='my-2'>
                <Form.Check type='checkpox' label='Is Admin' checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)}>
                </Form.Check>
            </Form.Group>

            <Button
              type='submit'
              variant='primary'
              style={{ marginTop: '1rem' }}
            >
              Update
            </Button>
          </Form>   
        )}
        </FormContainer>
    </>
  )
}

export default UserEditScreen