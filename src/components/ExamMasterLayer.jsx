import React from 'react'
import ExamMasterForm from './child/ExamMasterForm'
import ExamMasterList from './child/ExamMasterList'


const ExamMasterLayer = () => {
  return (
    <div>
      <div className="row gy-4">
      <ExamMasterList/>
    </div>
    </div>
  )
}

export default ExamMasterLayer
