import React, { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import './media.css';
import Loader from "./components/loader"
import { fetchUser } from "./store/actions/userAction";
import Content from "./components/Content";
import Search from "./components/Search";
import CreateContent from "./components/CreateContent";

const Welcome = () => {
  const dispatch : any = useDispatch();
  let { user } = useSelector((state: any) => state.user)
  let [insidePost , SetInsidePost] = useState(false)
  let [showMore , SetShowMore] = useState(false)
  let [viewUserPosts , SetViewUserPosts] = useState(null)
  let [commentParentID, SetCommentParentID] = useState<any>(null);
  let [backFromComments, SetBackFromComments] = useState<any>(false);
  let [sort , SetSort] = useState(true);
  const [showCreateContent, SetShowCreateContent] = useState(false)
  const [followed,SetFollowed] = useState(false)

  const fetchUserDetails = useCallback(() => {
    fetch(process.env.REACT_APP_API_ENDPOINT + "users/me", {
      method: "GET",
      credentials: "include",
      // Pass authentication token as bearer token in header
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    }).then(async response => {
      if (response.ok) {
        const data = await response.json()
        const dataD = { ...user , details: data }
        dispatch(fetchUser(dataD))
      } else {
        if (response.status === 401) {
          // Edge case: when the token has expired.
          // This could happen if the refreshToken calls have failed due to network error or
          // User has had the tab open from previous day and tries to click on the Fetch button
          window.location.reload()
        } else {
          const dataD = { ...user , details: null }
          dispatch(fetchUser(dataD))
        }
      }
    })
    // eslint-disable-next-line
  }, [dispatch, user.token])

  useEffect(() => {
    // fetch only when user details are not present
    if (!user.details) {
      fetchUserDetails()
    }
  }, [user.details, fetchUserDetails])

  const logoutHandler = () => {
    fetch(process.env.REACT_APP_API_ENDPOINT + "users/logout", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    }).then(async response => {
      const dataD = { ...user , details: undefined , token: null }
      dispatch(fetchUser(dataD))
      window.localStorage.setItem("logout", (Date.now()).toString())
    })
  }

  // const refetchHandler = () => {
  //   // set details to undefined so that spinner will be displayed and
  //   //  fetchUserDetails will be invoked from useEffect
  //   const dataD = { ...user , details: undefined }
  //   dispatch(fetchUser(dataD))
  // }
  
  return user.details === null ? (
    <>{`Error Loading User details`}</>
  ) : !user.details ? (
    <Loader />
  ) : (
    <>      {
      !showCreateContent && 
      <div className="social">
            {
              insidePost ? <>
                <div className="back secondLayer" onClick={ () => {
                  SetBackFromComments(true);
                }}>
                    <span className="bi bi-arrow-left"></span>
                    <span className="">Back to Posts</span>
                  </div> 
                </> : <>
                <Search 
                viewUserPosts={viewUserPosts}
                SetViewUserPosts={SetViewUserPosts}
                SetBackFromComments={SetBackFromComments}
                followed={followed}
                SetFollowed={SetFollowed}
                />
              </>
            }
                <div className="details secondLayer" onClick={()=>{ SetShowMore(!showMore) }}>
                  <span>{user.details.name}</span>
                  <span className={`bi bi-chevron-${ showMore ? "up" : "down"}`} ></span>
                </div>
                {
                  showMore && <div className="moreDetails baseLayer">
                  <div className="secondLayer" onClick={() => { 
                    SetShowMore(false)
                    SetCommentParentID(null)
                    SetViewUserPosts(user.details.name);
                  }}>
                    <span className="bi bi-list-nested"></span>
                    <span className="">My Posts</span>
                  </div>
                  <div className="secondLayer" onClick={logoutHandler}>
                    <span className="bi bi-box-arrow-right"></span>
                    <span className="">Sign Out</span>
                  </div>
                </div> 
                }
            </div>
    }
            
          <CreateContent 
          insidePost={insidePost} 
          commentParentID={commentParentID} 
          SetViewUserPosts={SetViewUserPosts} 
          sort={sort} 
          SetSort={SetSort}
          showCreateContent={showCreateContent}
           SetShowCreateContent={SetShowCreateContent}
          />
          {
            !showCreateContent && 
                  <Content
                  sort={sort}
                  SetSort={SetSort}
                  insidePost={insidePost}
                  SetInsidePost={SetInsidePost}
                  viewUserPosts={viewUserPosts}
                  SetViewUserPosts={SetViewUserPosts}
                  commentParentID={commentParentID}
                  SetCommentParentID={SetCommentParentID}
                  SetBackFromComments={SetBackFromComments}
                  backFromComments={backFromComments}
                  followed={followed}
                  SetFollowed={SetFollowed}
                  />
          }
    </>
  )
}

export default Welcome