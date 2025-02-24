import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Toast from "../ui/Toast"
import axios from "axios"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

export default function StudentAdmissionForm() {
  const accessToken = localStorage.getItem("accessToken")
  const navigate = useNavigate()

  const tenant = useSelector((state) => state.branch.tenant)
  const academicYear = useSelector((state) => state.branch.academicYear)

  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [allFieldsValid, setAllFieldsValid] = useState(true)
  const [fetchClass, setFetchClass] = useState([])
  const [imagePreview, setImagePreview] = useState({})

  // Initial form state with all fields
  const initialFormState = {
    grNo: "",
    rollNo: "",
    classId: "",
    division: "",
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    category: "",
    religion: "",
    caste: "",
    admissionDate: "",
    bloodGroup: "",
    house: "",
    height: "",
    weight: "",
    fatherName: "",
    fatherPhone: "",
    fatherOccupation: "",
    fatherPhoto: null,
    fatherEmail: "",
    motherName: "",
    motherPhone: "",
    motherOccupation: "",
    motherPhoto: null,
    motherEmail: "",
    address: "",
    city: "",
    state: "",
    postCode: "",
    studentAadharCard: null,
    studentPhotograph: null,
    guardianName: "",
    guardianEmail: "",
    guardianOccupation: "",
    guardianPhone: "",
    guardianRelation: "",
    guardianPhoto: "",
  }

  const [formData, setFormData] = useState(initialFormState)
  const [validationState, setValidationState] = useState({
    // All validation states initialized as true
    grNo: true,
    rollNo: true,
    classId: true,
    division: true,
    firstName: true,
    lastName: true,
    gender: true,
    dob: true,
    category: true,
    religion: true,
    caste: true,
    admissionDate: true,
    bloodGroup: true,
    house: true,
    height: true,
    weight: true,
    fatherName: true,
    fatherPhone: true,
    fatherOccupation: true,
    fatherPhoto: true,
    fatherEmail: true,
    motherName: true,
    motherPhone: true,
    motherOccupation: true,
    motherPhoto: true,
    motherEmail: true,
    address: true,
    city: true,
    state: true,
    postCode: true,
    studentAadharCard: true,
    studentPhotograph: true,
    guardianName: true,
    guardianEmail: true,
    guardianOccupation: true,
    guardianPhone: true,
    guardianRelation: true,
    guardianPhoto: true,
  })

  // Validation function
  const validateField = (name, value) => {
    let isValid = false

    switch (name) {
      case "fatherEmail":
      case "motherEmail":
      case "guardianEmail":
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        isValid = emailPattern.test(value)
        break

      case "firstName":
      case "lastName":
      case "fatherName":
      case "motherName":
      case "guardianName":
      case "guardianRelation":
        const fullNamePattern = /^[A-Za-z\s]+$/
        isValid = fullNamePattern.test(value)
        break

      case "motherPhone":
      case "fatherPhone":
      case "guardianPhone":
        const phonePattern = /^[6-9][0-9]{9}$/
        isValid = phonePattern.test(value)
        break

      case "religion":
      case "caste":
        const ReligionCastePattern = /^[A-Za-z\s]+$/
        isValid = ReligionCastePattern.test(value)
        break

      case "fatherOccupation":
      case "motherOccupation":
      case "guardianOccupation":
        const occupationPattern = /^[A-Za-z\s]+$/
        isValid = occupationPattern.test(value)
        break

      case "grNo":
      case "rollNo":
      case "classId":
      case "division":
      case "height":
      case "weight":
      case "postCode":
      case "bloodGroup":
      case "dob":
      case "admissionDate":
        isValid = value.trim() !== ""
        break

      default:
        isValid = true
        break
    }

    return isValid
  }

  // Handle input changes
  const handleInputChange = (event) => {
    const { name, value, type, files } = event.target

    if (type === "file" && files.length > 0) {
      const selectedFile = files[0]
      setFormData((prevData) => ({
        ...prevData,
        [name]: selectedFile,
      }))

      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview((prevPreviews) => ({
          ...prevPreviews,
          [name]: reader.result,
        }))
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }))

      const isInputValid = validateField(name, value)
      setValidationState((prevState) => ({
        ...prevState,
        [name]: isInputValid,
      }))
    }
  }

  // Handle guardian radio button changes
  const handleRadioBtn = (e) => {
    const { value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      guardianRelation: value,
    }))
    setIsVisible(value === "guardian")
  }

  // Fetch class list on component mount
  useEffect(() => {
    const fetchClassList = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_LOCAL_API_URL}class/list?medium=${tenant}&year=${academicYear}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )
        if (response.data.data) {
          setFetchClass(response.data.data)
        }
      } catch (error) {
        console.error("Error fetching class list:", error)
      }
    }
    fetchClassList()
  }, [tenant, academicYear, accessToken])

  // Group class data by category
  const groupedData = fetchClass.reduce((acc, curr) => {
    const { category, class: className, id } = curr
    if (!acc[category]) acc[category] = []
    acc[category].push({ id, className })
    return acc
  }, {})

  // Check form validity
  useEffect(() => {
    const isValid = Object.values(validationState).every((valid) => valid)
    setAllFieldsValid(isValid)
  }, [validationState])

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault()

    if (allFieldsValid) {
      setIsLoading(true)
      try {
        const formDataToSend = new FormData()

        Object.entries(formData).forEach(([key, value]) => {
          if (value !== "" && value !== null && value !== undefined) {
            if (value instanceof File) {
              formDataToSend.append(key, value, value.name)
            } else {
              formDataToSend.append(key, value)
            }
          }
        })

        const response = await axios.post(
          `${import.meta.env.VITE_LOCAL_API_URL}admin/add-student?medium=${tenant}&year=${academicYear}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        )

        Toast.showSuccessToast("Student created successfully!")
        // Optionally navigate to another page
        // navigate(`/student/form/print/${response.data.data.id}`)
      } catch (error) {
        if (error.response) {
          Toast.showWarningToast(error.response.data.message)
        } else if (error.request) {
          Toast.showErrorToast("Sorry, our server is down.")
        } else {
          Toast.showErrorToast("Sorry, please try again later.")
        }
      } finally {
        setIsLoading(false)
      }
    } else {
      Toast.showWarningToast("Please fill in all required fields.")
    }
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit}>
        {/* Student Details Section */}
        <div className="text-lg font-bold mt-3 mb-3">Student Detail</div>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Basic Information Fields */}
              <div>
                <Label htmlFor="grNo">
                  Gr No. <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="grNo"
                  name="grNo"
                  type="number"
                  value={formData.grNo}
                  onChange={handleInputChange}
                  className={!validationState.grNo ? "border-red-500" : ""}
                />
              </div>

              {/* Add all other fields following the same pattern... */}
              {/* Roll No */}
              <div>
                <Label htmlFor="rollNo">Roll Number</Label>
                <Input
                  id="rollNo"
                  name="rollNo"
                  type="text"
                  value={formData.rollNo}
                  onChange={handleInputChange}
                  className={!validationState.rollNo ? "border-red-500" : ""}
                />
              </div>

              {/* Class */}
              <div>
                <Label htmlFor="classId">
                  Class <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleInputChange({ target: { name: "classId", value } })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(groupedData).map((category) => (
                      <optgroup key={category} label={category}>
                        {groupedData[category].map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.className}
                          </SelectItem>
                        ))}
                      </optgroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Division */}
              <div>
                <Label htmlFor="division">
                  Division <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleInputChange({ target: { name: "division", value } })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* First Name */}
              <div>
                <Label htmlFor="firstName">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={!validationState.firstName ? "border-red-500" : ""}
                />
                {!validationState.firstName && <p className="text-red-500 text-sm mt-1">Invalid first name</p>}
              </div>

              {/* Last Name */}
              <div>
                <Label htmlFor="lastName">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={!validationState.lastName ? "border-red-500" : ""}
                />
                {!validationState.lastName && <p className="text-red-500 text-sm mt-1">Invalid last name</p>}
              </div>

              {/* Gender */}
              <div>
                <Label htmlFor="gender">
                  Gender <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleInputChange({ target: { name: "gender", value } })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date of Birth */}
              <div>
                <Label htmlFor="dob">
                  Date of Birth <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className={!validationState.dob ? "border-red-500" : ""}
                />
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleInputChange({ target: { name: "category", value } })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="OBC">OBC</SelectItem>
                    <SelectItem value="Special">Special</SelectItem>
                    <SelectItem value="PWD">Physically Challenge</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Religion */}
              <div>
                <Label htmlFor="religion">Religion</Label>
                <Input
                  id="religion"
                  name="religion"
                  type="text"
                  value={formData.religion}
                  onChange={handleInputChange}
                  className={!validationState.religion ? "border-red-500" : ""}
                />
                {!validationState.religion && <p className="text-red-500 text-sm mt-1">Invalid religion</p>}
              </div>

              {/* Caste */}
              <div>
                <Label htmlFor="caste">Caste</Label>
                <Input
                  id="caste"
                  name="caste"
                  type="text"
                  value={formData.caste}
                  onChange={handleInputChange}
                  className={!validationState.caste ? "border-red-500" : ""}
                />
                {!validationState.caste && <p className="text-red-500 text-sm mt-1">Invalid caste</p>}
              </div>

              {/* Admission Date */}
              <div>
                <Label htmlFor="admissionDate">Admission Date</Label>
                <Input
                  id="admissionDate"
                  name="admissionDate"
                  type="date"
                  value={formData.admissionDate}
                  onChange={handleInputChange}
                  className={!validationState.admissionDate ? "border-red-500" : ""}
                />
              </div>

              {/* Blood Group */}
              <div>
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select onValueChange={(value) => handleInputChange({ target: { name: "bloodGroup", value } })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* House */}
              <div>
                <Label htmlFor="house">House</Label>
                <Select onValueChange={(value) => handleInputChange({ target: { name: "house", value } })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Red">Red</SelectItem>
                    <SelectItem value="Blue">Blue</SelectItem>
                    <SelectItem value="Green">Green</SelectItem>
                    <SelectItem value="Yellow">Yellow</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Height */}
              <div>
                <Label htmlFor="height">Height [cm]</Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleInputChange}
                  className={!validationState.height ? "border-red-500" : ""}
                />
              </div>

              {/* Weight */}
              <div>
                <Label htmlFor="weight">Weight [kg]</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className={!validationState.weight ? "border-red-500" : ""}
                />
              </div>
              {/* Continue with all other form sections */}
            </div>
          </CardContent>
        </Card>

        {/* Parent Guardian Detail Section */}
        <div className="text-lg font-bold mt-3 mb-3">Parent Guardian Detail</div>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Father's Details */}
              <div>
                <Label htmlFor="fatherName">
                  Father Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fatherName"
                  name="fatherName"
                  type="text"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  className={!validationState.fatherName ? "border-red-500" : ""}
                />
                {!validationState.fatherName && <p className="text-red-500 text-sm mt-1">Invalid father's name</p>}
              </div>

              <div>
                <Label htmlFor="fatherPhone">Father Phone</Label>
                <Input
                  id="fatherPhone"
                  name="fatherPhone"
                  type="number"
                  value={formData.fatherPhone}
                  onChange={handleInputChange}
                  className={!validationState.fatherPhone ? "border-red-500" : ""}
                />
                {!validationState.fatherPhone && <p className="text-red-500 text-sm mt-1">Invalid father's phone</p>}
              </div>

              <div>
                <Label htmlFor="fatherOccupation">
                  Father Occupation <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fatherOccupation"
                  name="fatherOccupation"
                  type="text"
                  value={formData.fatherOccupation}
                  onChange={handleInputChange}
                  className={!validationState.fatherOccupation ? "border-red-500" : ""}
                />
                {!validationState.fatherOccupation && (
                  <p className="text-red-500 text-sm mt-1">Invalid father's occupation</p>
                )}
              </div>

              <div>
                <Label htmlFor="fatherEmail">Father Email</Label>
                <Input
                  id="fatherEmail"
                  name="fatherEmail"
                  type="email"
                  value={formData.fatherEmail}
                  onChange={handleInputChange}
                  className={!validationState.fatherEmail ? "border-red-500" : ""}
                />
                {!validationState.fatherEmail && <p className="text-red-500 text-sm mt-1">Invalid father's email</p>}
              </div>

              <div>
                <Label htmlFor="fatherPhoto">Father Photo</Label>
                <Input
                  id="fatherPhoto"
                  name="fatherPhoto"
                  type="file"
                  onChange={handleInputChange}
                  className={!validationState.fatherPhoto ? "border-red-500" : ""}
                />
                {imagePreview.fatherPhoto && (
                  <img
                    src={imagePreview.fatherPhoto || "/placeholder.svg"}
                    alt="Father Preview"
                    className="mt-2 w-20 h-20 rounded-full object-cover"
                  />
                )}
              </div>

              {/* Mother's Details */}
              <div>
                <Label htmlFor="motherName">
                  Mother Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="motherName"
                  name="motherName"
                  type="text"
                  value={formData.motherName}
                  onChange={handleInputChange}
                  className={!validationState.motherName ? "border-red-500" : ""}
                />
                {!validationState.motherName && <p className="text-red-500 text-sm mt-1">Invalid mother's name</p>}
              </div>

              <div>
                <Label htmlFor="motherPhone">Mother Phone</Label>
                <Input
                  id="motherPhone"
                  name="motherPhone"
                  type="number"
                  value={formData.motherPhone}
                  onChange={handleInputChange}
                  className={!validationState.motherPhone ? "border-red-500" : ""}
                />
                {!validationState.motherPhone && <p className="text-red-500 text-sm mt-1">Invalid mother's phone</p>}
              </div>

              <div>
                <Label htmlFor="motherOccupation">
                  Mother Occupation <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="motherOccupation"
                  name="motherOccupation"
                  type="text"
                  value={formData.motherOccupation}
                  onChange={handleInputChange}
                  className={!validationState.motherOccupation ? "border-red-500" : ""}
                />
                {!validationState.motherOccupation && (
                  <p className="text-red-500 text-sm mt-1">Invalid mother's occupation</p>
                )}
              </div>

              <div>
                <Label htmlFor="motherEmail">Mother Email</Label>
                <Input
                  id="motherEmail"
                  name="motherEmail"
                  type="email"
                  value={formData.motherEmail}
                  onChange={handleInputChange}
                  className={!validationState.motherEmail ? "border-red-500" : ""}
                />
                {!validationState.motherEmail && <p className="text-red-500 text-sm mt-1">Invalid mother's email</p>}
              </div>

              <div>
                <Label htmlFor="motherPhoto">Mother Photo</Label>
                <Input
                  id="motherPhoto"
                  name="motherPhoto"
                  type="file"
                  onChange={handleInputChange}
                  className={!validationState.motherPhoto ? "border-red-500" : ""}
                />
                {imagePreview.motherPhoto && (
                  <img
                    src={imagePreview.motherPhoto || "/placeholder.svg"}
                    alt="Mother Preview"
                    className="mt-2 w-20 h-20 rounded-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* Guardian Section */}
            <div className="mt-4">
              <Label>
                If guardian is <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                defaultValue={formData.guardianRelation}
                onValueChange={(value) => handleRadioBtn({ target: { value } })}
                className="flex flex-row space-x-2 mt-2"
              >
                <RadioGroupItem value="mother" id="mother" />
                <Label htmlFor="mother">Mother</Label>
                <RadioGroupItem value="father" id="father" />
                <Label htmlFor="father">Father</Label>
                <RadioGroupItem value="guardian" id="guardian" />
                <Label htmlFor="guardian">Guardian</Label>
              </RadioGroup>
            </div>

            {/* Guardian Details (Conditional Rendering) */}
            {isVisible && (
              <div className="mt-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <Label htmlFor="guardianName">
                      Guardian Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="guardianName"
                      name="guardianName"
                      type="text"
                      value={formData.guardianName}
                      onChange={handleInputChange}
                      className={!validationState.guardianName ? "border-red-500" : ""}
                    />
                    {!validationState.guardianName && (
                      <p className="text-red-500 text-sm mt-1">Invalid guardian's name</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="guardianRelation">Guardian Relation</Label>
                    <Input
                      id="guardianRelation"
                      name="guardianRelation"
                      type="text"
                      value={formData.guardianRelation}
                      onChange={handleInputChange}
                      className={!validationState.guardianRelation ? "border-red-500" : ""}
                    />
                    {!validationState.guardianRelation && (
                      <p className="text-red-500 text-sm mt-1">Invalid guardian's relation</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="guardianPhone">
                      Guardian Phone <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="guardianPhone"
                      name="guardianPhone"
                      type="number"
                      value={formData.guardianPhone}
                      onChange={handleInputChange}
                      className={!validationState.guardianPhone ? "border-red-500" : ""}
                    />
                    {!validationState.guardianPhone && (
                      <p className="text-red-500 text-sm mt-1">Invalid guardian's phone</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="guardianOccupation">
                      Guardian Occupation <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="guardianOccupation"
                      name="guardianOccupation"
                      type="text"
                      value={formData.guardianOccupation}
                      onChange={handleInputChange}
                      className={!validationState.guardianOccupation ? "border-red-500" : ""}
                    />
                    {!validationState.guardianOccupation && (
                      <p className="text-red-500 text-sm mt-1">Invalid guardian's occupation</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="guardianPhoto">Guardian Photo</Label>
                    <Input
                      id="guardianPhoto"
                      name="guardianPhoto"
                      type="file"
                      onChange={handleInputChange}
                      className={!validationState.guardianPhoto ? "border-red-500" : ""}
                    />
                    {imagePreview.guardianPhoto && (
                      <img
                        src={imagePreview.guardianPhoto || "/placeholder.svg"}
                        alt="Guardian Preview"
                        className="mt-2 w-20 h-20 rounded-full object-cover"
                      />
                    )}
                  </div>

                  <div>
                    <Label htmlFor="guardianEmail">Guardian Email</Label>
                    <Input
                      id="guardianEmail"
                      name="guardianEmail"
                      type="email"
                      value={formData.guardianEmail}
                      onChange={handleInputChange}
                      className={!validationState.guardianEmail ? "border-red-500" : ""}
                    />
                    {!validationState.guardianEmail && (
                      <p className="text-red-500 text-sm mt-1">Invalid guardian's email</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Parent Guardian Address Section */}
        <div className="text-lg font-bold mt-3 mb-3">Parent Guardian Address</div>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={!validationState.address ? "border-red-500" : ""}
                />
              </div>

              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={!validationState.city ? "border-red-500" : ""}
                />
              </div>

              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  type="text"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={!validationState.state ? "border-red-500" : ""}
                />
              </div>

              <div>
                <Label htmlFor="postCode">Postcode</Label>
                <Input
                  id="postCode"
                  name="postCode"
                  type="number"
                  value={formData.postCode}
                  onChange={handleInputChange}
                  className={!validationState.postCode ? "border-red-500" : ""}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Document Section */}
        <div className="text-lg font-bold mt-3 mb-3">Upload Document</div>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="studentAadharCard">Student Aadhaar</Label>
                <Input
                  id="studentAadharCard"
                  name="studentAadharCard"
                  type="file"
                  onChange={handleInputChange}
                  className={!validationState.studentAadharCard ? "border-red-500" : ""}
                />
                {imagePreview.studentAadharCard && (
                  <img
                    src={imagePreview.studentAadharCard || "/placeholder.svg"}
                    alt="Student Aadhar Preview"
                    className="mt-2 w-20 h-20 rounded-full object-cover"
                  />
                )}
              </div>

              <div>
                <Label htmlFor="studentPhotograph">Student Photograph</Label>
                <Input
                  id="studentPhotograph"
                  name="studentPhotograph"
                  type="file"
                  onChange={handleInputChange}
                  className={!validationState.studentPhotograph ? "border-red-500" : ""}
                />
                {imagePreview.studentPhotograph && (
                  <img
                    src={imagePreview.studentPhotograph || "/placeholder.svg"}
                    alt="Student Photograph Preview"
                    className="mt-2 w-20 h-20 rounded-full object-cover"
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="mt-4 flex justify-end">
          <Button type="submit" disabled={!allFieldsValid || isLoading} className="px-8 py-2">
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  )
}

