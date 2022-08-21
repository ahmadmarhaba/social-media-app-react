import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import '../Community.css'
const Search = ({viewUserPosts,SetViewUserPosts , SetBackFromComments} : any)=>{

    const [categoryList,SetCategoryList] = useState<any>(null)
    const [categorySearch,SetCategorySearch] = useState('')
    let { user } = useSelector((state: any) => state.user)
    
    useEffect(()=>{
        SetCategorySearch('');
    },[viewUserPosts])
    
    const handleSearch = (e : any) => {
        e.preventDefault();
        let name = e.target.value.trim();
        SetCategorySearch(name);
        searchUsers(name)
    }
    function searchUsers(name : string){
        fetch(process.env.REACT_APP_API_ENDPOINT + "users/search", {
          method: "POST",
          credentials: "include",
          // Pass authentication token as bearer token in header
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({name})
        }).then(async response => {
          if (response.ok) {
            const data = await response.json()  
            if(data.success){
                SetCategoryList(data.users)
            }
          }
        })
      }
    return (
        <div className={`search`}>
            {
                viewUserPosts ? <>
                    <span className={`bi bi-arrow-left secondLayer`} onClick={()=>{ SetViewUserPosts(null);SetBackFromComments(true) }}>Back</span> 
                 <div className="mainTitle">
                  {viewUserPosts ? viewUserPosts : `Followed Feed`}
                </div>
                </> 
                : <input type="text" placeholder="Search for user..." maxLength={150} onChange={handleSearch} autoComplete="off"/>
            }     
            {
                categorySearch? 
                <div className={`baseLayer categoryListPicker`}>
                {
                    categoryList && categoryList.length > 0 ? categoryList.map((user : any , index : number)=>{
                        return (
                        <div key={index} className={`categoryTypeDiv secondLayer`}
                        onClick={ (e) =>{
                            e.preventDefault();
                            
                            SetViewUserPosts(user)
                        }}>
                            <div>{user}</div>
                        </div>
                        )
                    }) : <p className={`notFound`}>"{categorySearch}" was not found</p>
                }
                </div> : null
            }
        </div>
    )
}
export default Search;