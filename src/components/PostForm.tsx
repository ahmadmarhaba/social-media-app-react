import { useRef, useState } from 'react'
import moment from "moment";
import '../Content.css'


const PostForm = ({ parentID,contentID, prof, title, mediaFolder, mediaFiles, mediaUrl, postText, sameUser, postDate, commentsCount, postAgree, postDisagree, userInteracted, postViews, postEdited , getContent , setUserOpinion , editContent , deleteContent} : any)=> {
  
    let [textBeingEdited,SetTextBeingEdited] = useState(false);
    let [showMoreText,SetShowMoreText] = useState(false);
    let [showUserBoxTools,SetShowUserBoxTools] = useState(false);
    let EditedTextRef = useRef(null);
    mediaFiles = mediaFiles.split(",")

    return (
      <div className={`borderColor postContainer`}>
        {
          !textBeingEdited ? 
          <div className={`secondLayer userBoxTools bi bi-three-dots-vertical`} onClick={() => { SetShowUserBoxTools(!showUserBoxTools) }}>
          </div>
          : null
        }
        <div className={`userProfilePic`} style={{
           backgroundImage: `url(${prof.image ? `/MediaFiles/ProfilePic/${prof.token}/${prof}` : 'https://img.icons8.com/office/40/000000/test-account.png'})`  
        }}></div>
        <div className={`userContentData`}
           onClick={() => { 
              // window.history.pushState({}, document.title, `/?user=${name}&code=${code}`);
              // socket.emit('OpenWindow',{
              //   window : 'Profile'
              // })
            }}
        >
          <span className={`userProfileName`}>{prof.name}</span>
          <div className={`userDateTime`}>{moment(new Date(Number(postDate))).local().format('MMMM Do YYYY, hh:mm a')}</div>
        </div>
        {
          title != null && title != '' && !parentID &&
             <div className={`userProfileTitle`}>
              {title}
             <span> {postEdited ? '(Edited)' : ''}</span>
             </div>
        }
        {
          showUserBoxTools && !textBeingEdited ? <div className={`baseLayer userBoxToolContainer`}>
            {
             sameUser ?
                <>
                  <input type="button" value="Edit" className={`editContent secondLayer`}
                    onClick={() => { SetTextBeingEdited(true); SetShowUserBoxTools(false);}}
                  />
                  <input type="button" value="Delete" className={`deleteContent secondLayer`}
                    onClick={() => {
                      SetShowUserBoxTools(false);
                      deleteContent({contentID });
                    }}
                  />
                </>
                : <input type="button" value="Report" className={`reportContent secondLayer`} />
            }
          </div> : null
        }
        {/* {
          !textBeingEdited ? 
          <div className={`userUploadedMedia}`}>
            {   
            mediaFiles ? 
            mediaFiles.map((media , index) => {
              return (media.endsWith(".png") || media.endsWith(".jpg") || media.endsWith(".jpeg")) ?
                <img key={index} className={`secondLayer`} src={`/MediaFiles/PostFiles/${token}/${mediaFolder}/${media}`} />
                : (
                  (media.endsWith(".mp4") || media.endsWith(".MP4") || media.endsWith(".mov")|| media.endsWith(".x-matroska")) ?
                    <video key={index} className={`secondLayer`} controls>
                      <source src={`/MediaFiles/PostFiles/${token}/${mediaFolder}/${media}`} />
                      Can't view video here
                    </video> : null)
              }) : null
            }
            {
              mediaUrl ? 
              <iframe className={`secondLayer`} src={`https://www.youtube.com/embed/${mediaUrl}?enablejsapi=1&modestbranding=1`} frameBorder={0} allowFullScreen></iframe>
              : null
            }
          </div> : null
        } */}
        {postText ? <>
          {!textBeingEdited?
          <div className={`userProfileText`}>
              {
                postText.length > 0 ? 
                <>
                  <span className={`shortTextContent`}>{postText.substr(0, 350)}</span>
                  {!showMoreText && postText.length >= 350 ? <>
                    <div className="showMoreDots">... </div>
                    <input type="button" className={`readMoreButton`} value="Read More"
                      onClick={() => { SetShowMoreText(true) }}
                    />
                  </>
                    : null
                  }
                  {showMoreText ? <span className={`readMoreContent`}>{postText.substr(350, postText.length)} </span> : null}
                </>
                  : <span className={`shortTextContent`}>{postText}</span> 
              }
          </div>
            : <textarea rows={6} className={`userProfileText`} defaultValue={postText} ref={EditedTextRef}></textarea>
          }
        </>  : null }
          
        {
          textBeingEdited ? 
          <div className={`confirmationDiv`}>
            <input type="button" value="Discard" className={`secondLayer discardContent`}
              onClick={() => { SetTextBeingEdited(false) }}
            />
            <input type="button" value="Save" className={`saveContent selectedButton`}
              onClick={() => {
                const text = (EditedTextRef.current as any).value;
                SetTextBeingEdited(false)
                editContent({contentID , text})
              }}
            />
          </div> : null
        }
  
        {!textBeingEdited ? <div className={`userBoxOptions`}>
          {/* <div className={`borderColor contentCounterDiv`}>
            <div>{postAgree} Likes</div>
            <div>{postDisagree} Dislikes</div>
            {
              !itsReply ?
                <div>{commentsCount}{!itsComment ? " Comment" : " Reply"}</div>
                : null
            }
            {
              !itsReply && !itsComment && postViews != null?
                <>
                  <div>{postViews - 1} Views</div>
                  <div>0 Shares</div>
                </> : null
            }
          </div> */}
          <div className={`InteractionDiv`}>
            <input type="button" value={`${postAgree} Like${postAgree > 1 ? 's':''}`} className={`agreeButton secondLayer ${userInteracted === 1 ? "selectedButton" : ''}`}
              onClick={()=>{
                setUserOpinion({
                  contentID,
                  opinion : 1,
                })
              }}
            />
            <input type="button" value={`${postDisagree} Dislike${postDisagree > 1 ? 's':''}`} className={`disagreeButton secondLayer ${userInteracted === 2 ? "selectedButton" : ''}`}
              onClick={()=>{
                setUserOpinion({
                  contentID,
                  opinion : 2,
                })
              }}
            />
            {
              !parentID &&
              <input type="button" value={`${commentsCount} Comments`} className={`secondLayer`}
              onClick={() =>  {
                getContent({username : null , parentID : contentID})
              }}
              />
            }
            {
              !parentID && <input type="button" value="Share" className={`secondLayer`} />
            }
          </div>
        </div> : null}
      </div>
    )
    function ShowCommentsFunc(socket: any, id: number, onlyView: boolean, itsReply: boolean) {
      // if (!OnlyView) {
      //   //show createcomment textarea
      //   ShowCreateComment(true)
      // }else{
      //   ShowCreateComment(false)
      // }
  
      socket.emit('getTopComments', {
        contentID: id,
        page : 1,
        itsComment: !itsReply
      })
      //socket.emit('getProfileSpecificContent', data)
    }
  
  }
  
  export default PostForm;