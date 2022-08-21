import { useEffect, useRef, useState } from "react"
// import { ShowError } from "../fields/error"
import PostForm from './PostForm'
import '../Content.css'
import { useSelector } from "react-redux"

const Content = ({ sort , SetSort ,insidePost , SetInsidePost , viewUserPosts ,backFromComments ,SetBackFromComments, commentParentID ,SetCommentParentID} :any) =>{

    let [JustScrolledToBottomPost , SetJustScrolledToBottomPost] = useState(false)

    let [WaitingForPost,SetWaitingForPost] = useState(true)

    let [PostsView, SetPosts] = useState<any>([]);
    const postPrevListRef = useRef<any>(PostsView)
    // const [CurrentPostViewing, SetCurrentPostViewing] = useState(null)

    let [page , SetPage]  = useState(1);

    let { user } = useSelector((state: any) => state.user)

    useEffect(()=>{
        getContent({username : viewUserPosts , parentID : commentParentID})
    },[sort])
    useEffect(()=>{
      if(viewUserPosts){
        getContent({username : viewUserPosts , parentID : commentParentID})
      }
    },[viewUserPosts])
    useEffect(()=>{
      if(backFromComments){
        SetBackFromComments(false)
        getContent({username : viewUserPosts , parentID : null})
      }
    },[backFromComments])


    function getContent({username , parentID} : any ){
      postPrevListRef.current = null;
      SetPosts(null)
      parentID ? SetInsidePost(true) : SetInsidePost(false);
      fetch(process.env.REACT_APP_API_ENDPOINT + "posts/fetch", {
        method: "POST",
        credentials: "include",
        // Pass authentication token as bearer token in header
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ username , parentID , sort })
      }).then(async response => {
        if (response.ok) {
          const data = await response.json();
          if(data.success){ 
            postPrevListRef.current = postPrevListRef.current && PostsView.length > 0 ? [...data.posts , ...postPrevListRef.current] : data.posts;
            SetPosts(postPrevListRef.current);
            SetPage(page + 5)
            SetJustScrolledToBottomPost(false)
          }
          SetCommentParentID(parentID)
        }
        else{
          postPrevListRef.current = null;
          SetPosts(null)
          SetCommentParentID(null)
        }
      })
    }
  

    function setUserOpinion({ contentID , opinion }  : any){
      fetch(process.env.REACT_APP_API_ENDPOINT + "posts/interact", {
        method: "POST",
        credentials: "include",
        // Pass authentication token as bearer token in header
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ contentID , opinion })
      }).then(async response => {
        if (response.ok) {
          const data = await response.json() 
          if(data.success){
              let content : any = postPrevListRef.current.find((cont : any) => cont._id == data.Content_ID)
              const contentIndex = postPrevListRef.current.indexOf(content)
             if(contentIndex < 0) return;
              content.userInteracted = data.opinion;
              content.agreeAmount = data.postAgree;
              content.disAgreeAmount = data.postDisagree;
              SetPosts((oldArray : any) => {
                let temp = [
                  ...oldArray.slice(0, contentIndex),
                  content,
                  ...oldArray.slice(contentIndex + 1),
                ]
                postPrevListRef.current = temp
                return temp;
              })
          }
        }
      })
    }

    function editContent({contentID  , text} : any){
      fetch(process.env.REACT_APP_API_ENDPOINT + "posts/edit", {
        method: "POST",
        credentials: "include",
        // Pass authentication token as bearer token in header
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({contentID  , text})
      }).then(async response => {
        if (response.ok) {
          const data = await response.json()  
          if(data.success){
            let content : any = postPrevListRef.current.find((cont : any) => cont._id == contentID)
            const contentIndex = postPrevListRef.current.indexOf(content)
            if(contentIndex < 0) return;
            content.Post_Text = text;
            content.Post_Edited = true;
            SetPosts((oldArray : any) => {
              let temp = [
                ...oldArray.slice(0, contentIndex),
                content,
                ...oldArray.slice(contentIndex + 1),
              ]
              postPrevListRef.current = temp
              return temp;
            })
          }
        }
      })
    }
    function deleteContent({contentID} : any){
      fetch(process.env.REACT_APP_API_ENDPOINT + "posts/delete", {
        method: "POST",
        credentials: "include",
        // Pass authentication token as bearer token in header
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({contentID})
      }).then(async response => {
        if (response.ok) {
          const data = await response.json()  
          if(data.success){
            console.log(data , contentID)
            let content : any = postPrevListRef.current.find((cont : any) => cont._id == contentID)
            const contentIndex = postPrevListRef.current.indexOf(content)
            if(contentIndex < 0) return;
            SetPosts((oldArray : any) => {
              delete oldArray[contentIndex];
              const filtered = oldArray.filter((post : any) => {
                return post !== undefined;
              });
              postPrevListRef.current = filtered;
              return filtered;
            })
          }
        }
      })
    }


    const handleContentScroll = (e :any) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    
        if(!bottom) return;
        
        if(!WaitingForPost && !JustScrolledToBottomPost) {
          SetWaitingForPost(true);
          SetJustScrolledToBottomPost(true)
            // socket.emit('getTopPosts',{
            //   categoryID : currentCategoryID,
            //   name : CurrentProfile ? CurrentProfile.name : null,
            //   code : CurrentProfile ? CurrentProfile.code : null,
            //   page : postCurrentPage
            // })
        }
      }


    return <>
            <div className={`contentContainer`} onScroll={handleContentScroll}>
            {PostsView != null && PostsView.length > 0 ?
              PostsView.map((data : any) => {
                return <PostForm key={data._id} parentID={data.Parent_ID} contentID={data._id} prof={data.prof} title={data.Post_Title} mediaFolder={data.Post_MediaFolder} mediaFiles={data.Post_MediaFiles} mediaUrl={data.Post_MediaUrl} postText={data.Post_Text} sameUser={data.sameUser} postDate={data.Post_Date} commentsCount={data.commentsCount} postAgree={data.agreeAmount} postDisagree={data.disAgreeAmount} userInteracted={data.userInteracted} postViews={0} postEdited={data.Post_Edited} getContent={getContent} setUserOpinion={setUserOpinion} editContent={editContent} deleteContent={deleteContent} />
              })
              : PostsView && PostsView.length === 0 ?
              <div className={`baseLayer loadingContent`}>{insidePost ? `No comments yet` : viewUserPosts ? `${viewUserPosts} doesn't have any posts yet` :`Follow people to have posts appear`}</div> 
              : PostsView == null && <div className={`baseLayer loadingContent`}>{`Loading...`}</div>
            }       
        </div>
    </>
}

export default Content;