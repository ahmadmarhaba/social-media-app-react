import '../Post.css'
import { useState,useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
// import {InsertYoutubeUrl , checkAcceptedExtensions} from './PostData';
// import axios from 'axios';

export default function CreateContent({  sort , SetSort, insidePost , commentParentID  , SetViewUserPosts} : any){
    // let [mediaUrl , SetMediaUrl] = useState(false)
    // let [mediaUploaded , SetMediaUploaded] = useState([])

    // let [PostType,SetPostType] = useState(null)
    // let youtubeIFrame = useRef(null)
    // let PostText = useRef(null)
    // let [PostUrl,SetPostUrl] = useState(null)
    // let [PostTitle,SetPostTitle] = useState(null)

    let { user } = useSelector((state: any) => state.user)
    // let [uploadURL , SetUploadURL] = useState<string>(null)

    const [showCreateContent, SetShowCreateContent] = useState(false)
    
    const ContentTitleRef = useRef<any>([])
    const ContentTextRef = useRef<any>([])

    function createContent({contentID , title , text} : any){
      fetch(process.env.REACT_APP_API_ENDPOINT + "posts/create", {
        method: "POST",
        credentials: "include",
        // Pass authentication token as bearer token in header
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({contentID , title , text})
      }).then(async response => {
        if (response.ok) {
          const data = await response.json()  
          if(data.success){
            console.log(data);
            !insidePost && !commentParentID && SetViewUserPosts(user.details.name)
            // SetPage(commentCurrentPage);
            // postPrevListRef.current = postPrevListRef.current ? [data.post , ...postPrevListRef.current] : data.post;
            // SetPosts(postPrevListRef.current);
          }
          SetShowCreateContent(false)
        }
      })
    }

    useEffect(() => {

      // socket.emit('fetchPostType')
      // socket.on("fetchPostType", function(data) {   
      // });
      // socket.on("discardPostCreation", ()=> {
      //   console.log("discardPostCreation")
      // });
      // socket.on("promptToDiscardPost",()=>{
      //   console.log("promptToDiscardPost")
      // })   
      // SetUploadURL("/upload?token=" + user.token+"&folderName="+ WindowLoad+'&directoryFolder=PostFiles')
    }, []);

    // const handlePostUrl = (e  :any) =>{
    //   e.preventDefault();
    //   if(InsertYoutubeUrl(e ,youtubeIFrame)) SetPostUrl(e.target.value.trim())
    // }
    // const handlePostTitle = (e : any) =>{
    //   e.preventDefault();
    //   SetPostTitle(e.target.value.trim())
    // }
    // const ShowDetail = index => e =>{
    //   e.preventDefault();
    //   let newArr = [...mediaUploaded]
    //   newArr[index].showDetails = !newArr[index].showDetails
    //   SetMediaUploaded(newArr) 
    // }
    // const UploadPostFile = async e => {
    //   const files = e.target.files
    //   const form = new FormData()
    //   let tempArray = mediaUploaded;
    //   let amountOfFiles = mediaUploaded.length;
    //   if(files[0].size >= 100 * 1024 * 1024){
    //     e.target.value = "";
    //     ShowError("File size huge exceeds 100 MB");
    //     return;
    //   }
    //   if(!checkAcceptedExtensions(files[0])) {
    //     e.target.value = "";
    //     ShowError("File type must be jpeg/jpg/png/mp4/mp3/mov/avi/mkv");
    //     return;
    //   }
    //     form.append('files', files[0], files[0].name)
    //     let data = {
    //       src : URL.createObjectURL(files[0]) ,
    //       name : files[0].name ,
    //       size: (files[0].size / 1024).toFixed(2),
    //       itsImage : files[0].type.includes("image"),
    //       percentage : "0%",
    //       showDetails : false
    //     }
    //     tempArray.push(data);
    //     URL.revokeObjectURL(files[0])        
    //     SetMediaUploaded([...tempArray]) 
    //     try {
    //       let index = amountOfFiles;
    //       await axios.request({
    //         method: "post", 
    //         url: uploadURL, 
    //         data: form,
    //         onUploadProgress: (progress) => {
    //           let ratio = progress.loaded / progress.total
    //           let percentage = (ratio * 100).toFixed(2) + "%";  
    //           if(mediaUploaded[index]){
    //             mediaUploaded[index].percentage = percentage
    //             SetMediaUploaded([...mediaUploaded]) 
    //           }
    //         }
    //       }).then( response => {
    //         if(response.data.ok){
    //           if(mediaUploaded[index]){
    //             mediaUploaded[index].percentage = "Uploaded Successfully"
    //             SetMediaUploaded(mediaUploaded) 
    //           }
    //         }else
    //           ShowError(response.data.error);
    //         e.target.value = "";
    //       }).catch((error) => {
    //         if(error.toString().includes("413") ){
    //           ShowError("File size huge exceeds 100 MB");
    //         }
    //         else
    //           ShowError(error);
    //         e.target.value = "";
    //       })
         
    //     } catch (err) {
    //       ShowError('Error uploading the files')
    //       console.log('Error uploading the files', err)
    //       e.target.value = "";
    //     } 
    // }
    return (  
      <>     

          {showCreateContent ? <div className='postDiv'>
            <input type="button" value="Discard" className={`secondLayer discardContent`}
              onClick={() => { SetShowCreateContent(false) }}
            />
            <input type="button" value="Save" className={`selectedButton`}
              onClick={() => {
                const title = (ContentTitleRef.current as any).value;
                const text = (ContentTextRef.current as any).value;
                createContent({contentID : commentParentID , title , text})
              }} />
                </div>
                : 
                <div className='postDiv'>
                  <div className="" onClick={()=>{ SetSort(!sort) }}>
                    <span className={`bi bi-sort-${sort ? 'down' : "up"}`} ></span>
                    <span>{`Sort by date`}</span>
                  </div>
                  <div className="selectedButton" onClick={()=>{ SetShowCreateContent(!showCreateContent) }}>
                    <span className={`bi bi-plus-lg`} ></span>
                    <span>{`Create`}</span>
                  </div>
                </div>
                } 
            {
              showCreateContent && <div className="createCommentContainer">
                {
                  !insidePost && <input type="text" placeholder="Title" ref={ContentTitleRef} />
                }
                <textarea rows={8} placeholder="Description" ref={ContentTextRef} />
              </div>
            }

      {/* <div className={`Nav`}>
        <div className={`NavButton`} onClick={()=>{    
          socket.emit("discardPost")
        }}>
              <span className={`bi bi-arrow-left`}></span>
              <p>Back</p>
        </div>
        <div className={`NavButton`} onClick={()=>{    
          SetMediaUrl(!mediaUrl)
        }}>
              <span className={`bi bi-youtube`}></span>
              <p>Add Youtube Url</p>
        </div>
        <label className={`NavButton`} htmlFor="mediaFileInsertPost">
              <span className={`bi bi-upload`}></span>
              <p>Add Media</p>
        </label>
        <input type="file" id="mediaFileInsertPost" onChange={UploadPostFile} style={{display:"none"}} />
        <div className={`NavButton`} onClick={()=>{    
          socket.emit("createPost",{
            categoryType : currentCategoryID,
            title : PostTitle ? PostTitle.trim() : null,
            text : PostText.current ? PostText.current.value : null,
            url : PostUrl && PostUrl.trim().length != 0 ? PostUrl.trim() : null
          })
        }}>
              <span className={`bi bi-save`}></span>
              <p>Submit Post</p>
        </div>
      </div>

            <div className={`MainDisplay`}>
            <div className={`${styles.PostContainer}`}>

            <div className={`borderColor ${styles.postType}`} >{PostType}</div>
            <div className={`${styles.divContainer}`} style={{marginTop:"0"}}>
                {
                  mediaUrl ? 
                  <div className={`${styles.mediaUrlPostDiv}`}>
                    <input type="text" placeholder="Insert Url here" onKeyUp={handlePostUrl}/>
                    <iframe ref={youtubeIFrame} className={`secondLayer`} typeof="text/html" frameBorder={0} allowFullScreen></iframe>
                  </div> : null
                }
                  {mediaUploaded && mediaUploaded.length > 0 ?
                  mediaUploaded.map((data , index)=>{  
                    let name = data.name;
                    let src = data.src;
                    let size = data.size;
                    let percentage = data.percentage;
                    size > 1024 ? size = (size/1024).toFixed(2) + " MB" : size += " KB"
                    name.length > 20 ? name = name.substring(0, 20) : null
                    return (
                      <div className={`borderColor ${styles.mediaFileDetails}`} key={`media_${index}_${ new Date().getTime()}`}>
                        {
                          !data.showDetails ? <>
                          <div className={`${styles.extraFileDetails} ${styles.horizontalDeails}`}>
                          
                          <p className={`${styles.mediaFileName}`}>{name}</p>
                          <span className={`${styles.mediaFileProgress}`}>{percentage}</span>
                          <input className={`secondLayer`} type="button" value="More Details"
                            onClick={ShowDetail(index)}
                          />
                          <input className={`pickedInput ${styles.cancelUploadFile}`} type="button" value="Remove" />
                          </div>
                          </> : 
                          <>
                          <div className={`${styles.extraFileDetails}`}>
                          <p className={`${styles.mediaFileName}`}>File: {name}</p>
                          <p className={`${styles.mediaFileName}`}>Size: {size}</p>
                          <span className={`${styles.mediaFileProgress}`}>{percentage}</span>
                          <input className={`pickedInput ${styles.cancelUploadFile}`} type="button" value="Remove" />
                          </div> 
                        {
                            data.itsImage ? <img src={src}/> : 
                            <video controls>
                              <source src={src}/> 
                              Your browser does not support the video tag.
                            </video>
                        }
                          </>     
                    }
                        </div>
                    ) 
                  }) :  null}
            </div>
            <textarea rows={8} ref={PostText} className={`secondLayer InputField`} placeholder="Type here..."></textarea>
              
            </div>
            </div> */}
        </>
    )
}

    
