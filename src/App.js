import React, { useState, useEffect } from 'react'
import './App.css';
import InstagramEmbed from 'react-instagram-embed';
import { db, auth } from './components/firebase/firebase'
import Post from './components/Post';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './components/ImageUpload';

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

function App() {
    const classes = useStyles()
    const [modalStyle] = useState(getModalStyle);
    const [posts, setPosts] = useState([])
    const [open, setOpen] = useState(false)
    const [openSignin, setOpenSignIn] = useState(false)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                setUser(authUser)
            } else {
                setUser(null)
            }
        })
        return () => {
            unsubscribe()
        }
    }, [user, username])
    useEffect(() => {
        db.collection('posts').orderBy("timestamp","desc").onSnapshot(snapshot => {
            setPosts(snapshot.docs.map(doc => ({ id: doc.id, post: doc.data() })))
        })
    }, [])
    const signIn = (e) => {
        e.preventDefault()
        auth.signInWithEmailAndPassword(email, password)
            .catch((error) => alert(error.message))
        setOpenSignIn(false)
    }
    const signUp = (e) => {
        e.preventDefault();
        auth.createUserWithEmailAndPassword(email, password)
            .then((authUser) => {
                return authUser.user.updateProfile({
                    displayName: username
                })
            })
            .catch((error) => alert(error.message))
        setOpen(false)
    }

    return (
        < div className="App" >
        
       
            <Modal
                open={openSignin}
                onClose={() => setOpenSignIn(false)}
            >
                <div style={modalStyle} className={classes.paper}>
                    <form className="app__signup">
                        <center>
                            <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />
                        </center>
                        <Input placeholder="email" type='text' value={email} onChange={((e) => setEmail(e.target.value))} />
                        <Input placeholder="password" type='password' value={password} onChange={((e) => setPassword(e.target.value))} />
                        <Button type="submit" onClick={signIn}>SignIn</Button>

                    </form>
                </div>
            </Modal>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
            >
                <div style={modalStyle} className={classes.paper}>
                    <form className="app__signup">
                        <center>
                            <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />
                        </center>
                        <Input placeholder="username" type='text' value={username} onChange={((e) => setUsername(e.target.value))} />
                        <Input placeholder="email" type='text' value={email} onChange={((e) => setEmail(e.target.value))} />
                        <Input placeholder="password" type='password' value={password} onChange={((e) => setPassword(e.target.value))} />
                        <Button type="submit" onClick={signUp}>Sign Up</Button>

                    </form>
                </div>
            </Modal>
            <div className="app__header ">
                <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />
                {user ? <Button variant="outlined" size="small" color="default" onClick={() => auth.signOut()}>LogOut</Button> : (
                <div className="app__loginContainer">
                    <Button style={{margin:'5px'}} variant="outlined" size="small" color="default" onClick={() => setOpenSignIn(true)}>SignIn</Button>
                    <Button variant="outlined" size="small" color="default" onClick={() => setOpen(true)}>SignUp</Button>
                </div>
            )
            }
            </div>
            <div className="app__posts">
            <div className="app__postsleft">
            {posts.map(({ post, id }) => <Post key={id} user={user} postId={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />)}
            </div>
            <div className="app__postsRight">
            <InstagramEmbed
                url='https://www.instagram.com/p/CI0rD5knX1-/?utm_source=ig_web_copy_link'
                 clientAccessToken='123|456'
                maxWidth={320}
                hideCaption={false}
                containerTagName='div'
                protocol=''
                injectScript
                onLoading={() => {}}
                onSuccess={() => {}}
                onAfterRender={() => {}}
                onFailure={() => {}}
                />
            </div>
            
            </div>
          
          
                 {user?.displayName? <ImageUpload username={user.displayName} />:(<h3>"Sorry you need to Login"</h3>)}
        </div >);
}

export default App;