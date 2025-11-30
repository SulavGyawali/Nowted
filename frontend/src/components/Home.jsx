import { useState, useEffect } from 'react'

import Menu from './Menu'
import List from './List'
import Content from './Content'

const Home = (props) => {
  return (
    <div className='text-white flex h-[100vh] items-center relative overflow-y-hidden'>
      <Menu 
      recentNotes={props.recentNotes}
      folders={props.folders}
      setFolders={props.setFolders}
      setCurrentFolder={props.setCurrentFolder}
      currentFolder={props.currentFolder}
      currentNote={props.currentNote}
      setCurrentNote={props.setCurrentNote}
      isLoggedIn={props.isLoggedIn}
      setIsLoggedIn={props.setIsLoggedIn}
      currentNoteId={props.currentNoteId}
      setCurrentNoteId={props.setCurrentNoteId}
      currentUser={props.currentUser}
      setLogout={props.setLogout}
      
      />
      <List 
      currentFolder={props.currentFolder}
      folderNotes={props.folderNotes}
      currentNoteId={props.currentNoteId}
      setCurrentNoteId={props.setCurrentNoteId}
      currentNote={props.currentNote}
      />
      <Content 
      currentNote={props.currentNote}
      setCurrentNote={props.setCurrentNote}
      currentFolder={props.currentFolder}
      setCurrentFolder={props.setCurrentFolder}
      currentNoteId={props.currentNoteId}
      setCurrentNoteId={props.setCurrentNoteId}
      setNewNote={props.setNewNote}
      setUpdatedNote={props.setUpdatedNote}
      handleAlert={props.handleAlert}
      shareUserId={props.shareUserId}
      setShareUserId={props.setShareUserId}
      handleShare={props.handleShare}
      />
    </div>
  )
}

export default Home
