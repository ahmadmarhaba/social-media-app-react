import { useEffect, useState } from "react";
import '../Community.css'
const Search = ({viewUserPosts,SetViewUserPosts , SetBackFromComments} : any)=>{

    const [categoryList,SetCategoryList] = useState<any>(null)
    const [categorySearch,SetCategorySearch] = useState('')

    useEffect(()=>{
        // socket.on('getCategoryList',(data)=>{
        //     if(!data) return;
        //     let catlist = data.categoryList ? JSON.parse(data.categoryList) : null
        //     let catlistSugg = data.categorySuggestionList ? JSON.parse(data.categorySuggestionList) : null
        //     SetCategoryList(catlist)
        //     SetCategoryListSuggestion(catlistSugg)
        // })
        // socket.on('getCategoryName',(data)=>{
        //     if(!data) return;
        //     SetCurrentCategoryName(data.categoryName)
        // })
    },[])
    
    const handleSearch = (e : any) => {
        e.preventDefault();
        let categoryName = e.target.value.trim();
        SetCategorySearch(categoryName);
        // socket.emit('getCategoryList',{ categoryName })
    }
    const handleRemoveCategory = (e : any) => {
        e.preventDefault();
        // socket.emit('getTopPosts',{
        //     categoryID : null,
        //     name : null,
        //     code : null,
        //     page : 1
        // })  
    }
    const handleSelectedCategory = (categoryID  :any,categoryName : any) => {
        SetCategoryList(null)
        SetCategorySearch("");
        // socket.emit('getTopPosts',{
        //     categoryID : categoryID,
        //     name : null,
        //     code : null,
        //     page : 1
        // })  
    }
    return (
        <div className={`search`}>
            {
                viewUserPosts ? <>
                    <span className={`bi bi-arrow-left`} onClick={()=>{ SetViewUserPosts(null);SetBackFromComments(true) }}>Back</span> 
                </> 
                : <input type="text" placeholder="Search for user..." maxLength={150} onChange={handleSearch} className={categoryList ? 'withBack' : ''} autoComplete="off"/>
            }     
            {
                categorySearch? 
                <div className={`baseLayer categoryListPicker`}>
                {
                    categoryList ? categoryList.map((category : any)=>{
                        return (
                        <div key={category.Category_ID} className={`secondLayer categoryTypeDiv`}
                        onClick={e=>{
                            e.preventDefault();
                            handleSelectedCategory(category.Category_ID ,category.Category_Name)
                        }}>
                            <div>{category.Category_Name}</div>
                            <p>{category.Category_Description}</p>
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