import React from 'react'
import { useEffect, useState } from 'react'
import { Modal, Button, Form } from "react-bootstrap"

function Booklist() {

    const [booklist, setbooklist] = useState([])
    const [show, setShow] = useState(false);
    const [showEdit, setShowEdit] = useState(false)

    const handleShow = () => setShow(!show);
    const handleShowEditModal = () => setShowEdit(!showEdit)
    
    // lấy dữ liệu
    useEffect(() => {
        async function fetchBookList() {
            const requestURL = 'http://localhost:8080/api/book/getall'
            const response = await fetch(requestURL)
            const responseJSON = await response.json()
            setbooklist(responseJSON)
        }

        fetchBookList()
    }, [])

    // Xóa đối tượng book có sẵn
    async function deleteBook(e) {
        const requestURL = 'http://localhost:8080/api/book/delete/' + e.target.name
        await fetch(requestURL, { method: 'DELETE' }).then(res => res.json())

        // Cập nhật State
        // await fetch('http://localhost:8080/api/book/getall').then(res => res.json()).then(data => setbooklist(data))
        const newBookList = [...booklist]
        const index = newBookList.findIndex(x => x.id === e.target.name)
        newBookList.splice(index, 1)
        setbooklist(newBookList)

    }
    
    // Thêm mới đối tượng book
    async function addBook() {
        // Khởi tạo đối tượng book
        const book = {
            title: document.getElementById("formBasicTitle").value,
            author: document.getElementById("formBasicAuthor").value,
            genre: document.getElementById("formBasicGenre").value,
            year: document.getElementById("formBasicYear").value,
        }
        // Gọi api để thêm mới đối tượng
        const requestURL = 'http://localhost:8080/api/book/create'
        await fetch(requestURL, {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(book),
        })

        handleShow()
        // Cập nhật lại State
        const requestURL2 = 'http://localhost:8080/api/book/getall'
        await fetch(requestURL2).then(res => res.json())
            .then(data => setbooklist(data))

    }

    // Mở modal
    async function openEditBookModal(e) {
        handleShowEditModal()
        const requestURL = 'http://localhost:8080/api/book/' + e.target.name
        const book = await fetch(requestURL).then(res => res.json())

        document.getElementById('editID').value = book.id
        document.getElementById('editTitle').value = book.Title
        document.getElementById('editAuthor').value = book.author
        document.getElementById('editGenre').value = book.genre
        document.getElementById('editYear').value = book.year
    }

    // Chỉnh sửa đối tương book
    async function editBook() {
        const book = {
            id: document.getElementById('editID').value,
            Title: document.getElementById('editTitle').value,
            author: document.getElementById('editAuthor').value,
            genre: document.getElementById('editGenre').value,
            year: document.getElementById('editYear').value
        }

        // Gọi api
        const requestURL = 'http://localhost:8080/api/book/update/' + book.id
        await fetch(requestURL, {
            method: 'PUT', headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(book),
        })

        handleShowEditModal()

        // Cập nhật State
        const requestURL2 = 'http://localhost:8080/api/book/getall'
        await fetch(requestURL2).then(res => res.json())
            .then(data => setbooklist(data))
    }

    return (
        <div className="container">
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>Title</td>
                        <td>Author</td>
                        <td>Genre</td>
                        <td>Year</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    {booklist.map(book => (
                        <tr key={book.id}>
                            <td>{book.id}</td>
                            <td>{book.Title}</td>
                            <td>{book.author}</td>
                            <td>{book.genre}</td>
                            <td>{book.year}</td>
                            <td><button className="btn btn-primary" name={book.id} onClick={e => openEditBookModal(e)} >Edit</button></td>
                            <td><button className="btn btn-warning" name={book.id} onClick={e => deleteBook(e)}>Delete</button></td>
                        </tr>

                    ))}
                </tbody>
            </table>
            <button style={{ float: 'left', marginLeft: '0px' }} className='btn btn-success px-3' onClick={handleShow}> Add </button>
            
            {/* modal thêm mới book */}
            <Modal show={show}>
                <Modal.Header >
                    <Modal.Title>Add book</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formBasicTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" placeholder="Enter title" />
                        </Form.Group>
                        <Form.Group controlId="formBasicAuthor">
                            <Form.Label>Author</Form.Label>
                            <Form.Control type="text" placeholder="Enter author" />
                        </Form.Group>
                        <Form.Group controlId="formBasicGenre">
                            <Form.Label>Genre</Form.Label>
                            <Form.Control type="text" placeholder="Enter genre" />
                        </Form.Group>
                        <Form.Group controlId="formBasicYear">
                            <Form.Label>Year</Form.Label>
                            <Form.Control type="text" placeholder="Enter year" />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={e => addBook()}>Add book</Button>
                    <Button variant="secondary" onClick={handleShow}>Close Modal</Button>
                </Modal.Footer>
            </Modal>

            {/* modal chỉnh sửa book */}
            <Modal show={showEdit}>
                <Modal.Header >
                    <Modal.Title>Edit book</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="editID">
                            <Form.Label>Id</Form.Label>
                            <Form.Control type="text" readOnly disabled />
                        </Form.Group>
                        <Form.Group controlId="editTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" />
                        </Form.Group>
                        <Form.Group controlId="editAuthor">
                            <Form.Label>Author</Form.Label>
                            <Form.Control type="text" />
                        </Form.Group>
                        <Form.Group controlId="editGenre">
                            <Form.Label>Genre</Form.Label>
                            <Form.Control type="text" />
                        </Form.Group>
                        <Form.Group controlId="editYear">
                            <Form.Label>Year</Form.Label>
                            <Form.Control type="text" />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={editBook}>Edit book</Button>
                    <Button variant="secondary" onClick={handleShowEditModal}>Close Modal</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Booklist;
