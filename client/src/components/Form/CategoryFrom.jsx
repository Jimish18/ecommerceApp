import React , {useState} from 'react'

const CategoryFrom = ({handleOnSubmit , value , setValue}) => {

    
  return (
    <form>
        <div className="mb-3">
            <input type="text" className="form-control" placeholder='Enter Category Name...' value = {value} onChange={(e) => setValue(e.target.value) }/>            
        </div>
        <button type="submit" className="btn btn-primary" onClick={handleOnSubmit}>Create</button>
    </form>
  )
}

export default CategoryFrom