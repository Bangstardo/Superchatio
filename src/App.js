import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

firebase.initializeApp({
// FireBase credentials 
});

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>random chat</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SingIn />}
      </section>
    </div>
  );
}

function SingIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
  }

  return (
    <>
      <button onClick={signInWithGoogle}>sign in with google</button>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    
    <button onClick={() => auth.singnOut}>sign out homs</button>
  )
}

function ChatRoom() {
  const dummy = useRef();
  const messageRef = firestore.collection('messages');
  const query = messageRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const[formValue, setFormValue] = useState('');

  const SendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }
  
  return(<>
    <main>

    {messages && messages.map(msg => <ChatMessage key={msg.id}/>)}

    <span ref={dummy}></span>

    </main>

    <form onSubmit={SendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder='do whatever'/>

      <button type='submit' disabled={!formValue}>yes</button>

    </form>
    </>)
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recieved';
  
  return (<>
    <div className={`message ${messageClass}`}>
      <p>{text}</p>
    </div>
  </>)
}

export default App;

