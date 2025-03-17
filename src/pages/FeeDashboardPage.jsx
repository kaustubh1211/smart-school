import FeeDashboardLayer from '@/components/FeeDashboardLayer'
import MasterLayout from '@/masterLayout/MasterLayout'
import React from 'react'

const FeeDashboardPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb leftTitle="Input Form" /> */}

        {/* FeeReportlayer */}
        <FeeDashboardLayer/>
      </MasterLayout>
    </>
  )
}

export default FeeDashboardPage
