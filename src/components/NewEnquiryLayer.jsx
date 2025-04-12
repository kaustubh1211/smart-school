import { useEffect, useState } from "react";
import { ArrowLeft, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Toast from "./ui/Toast";

// Import city data
const AndraPradesh = [
  "Anantapur",
  "Chittoor",
  "East Godavari",
  "Guntur",
  "Kadapa",
  "Krishna",
  "Kurnool",
  "Prakasam",
  "Nellore",
  "Srikakulam",
  "Visakhapatnam",
  "Vizianagaram",
  "West Godavari",
];
const ArunachalPradesh = [
  "Anjaw",
  "Changlang",
  "Dibang Valley",
  "East Kameng",
  "East Siang",
  "Kra Daadi",
  "Kurung Kumey",
  "Lohit",
  "Longding",
  "Lower Dibang Valley",
  "Lower Subansiri",
  "Namsai",
  "Papum Pare",
  "Siang",
  "Tawang",
  "Tirap",
  "Upper Siang",
  "Upper Subansiri",
  "West Kameng",
  "West Siang",
  "Itanagar",
];
const Assam = [
  "Baksa",
  "Barpeta",
  "Biswanath",
  "Bongaigaon",
  "Cachar",
  "Charaideo",
  "Chirang",
  "Darrang",
  "Dhemaji",
  "Dhubri",
  "Dibrugarh",
  "Goalpara",
  "Golaghat",
  "Hailakandi",
  "Hojai",
  "Jorhat",
  "Kamrup Metropolitan",
  "Kamrup (Rural)",
  "Karbi Anglong",
  "Karimganj",
  "Kokrajhar",
  "Lakhimpur",
  "Majuli",
  "Morigaon",
  "Nagaon",
  "Nalbari",
  "Dima Hasao",
  "Sivasagar",
  "Sonitpur",
  "South Salmara Mankachar",
  "Tinsukia",
  "Udalguri",
  "West Karbi Anglong",
];
const Bihar = [
  "Araria",
  "Arwal",
  "Aurangabad",
  "Banka",
  "Begusarai",
  "Bhagalpur",
  "Bhojpur",
  "Buxar",
  "Darbhanga",
  "East Champaran",
  "Gaya",
  "Gopalganj",
  "Jamui",
  "Jehanabad",
  "Kaimur",
  "Katihar",
  "Khagaria",
  "Kishanganj",
  "Lakhisarai",
  "Madhepura",
  "Madhubani",
  "Munger",
  "Muzaffarpur",
  "Nalanda",
  "Nawada",
  "Patna",
  "Purnia",
  "Rohtas",
  "Saharsa",
  "Samastipur",
  "Saran",
  "Sheikhpura",
  "Sheohar",
  "Sitamarhi",
  "Siwan",
  "Supaul",
  "Vaishali",
  "West Champaran",
];
const Chhattisgarh = [
  "Balod",
  "Baloda Bazar",
  "Balrampur",
  "Bastar",
  "Bemetara",
  "Bijapur",
  "Bilaspur",
  "Dantewada",
  "Dhamtari",
  "Durg",
  "Gariaband",
  "Janjgir Champa",
  "Jashpur",
  "Kabirdham",
  "Kanker",
  "Kondagaon",
  "Korba",
  "Koriya",
  "Mahasamund",
  "Mungeli",
  "Narayanpur",
  "Raigarh",
  "Raipur",
  "Rajnandgaon",
  "Sukma",
  "Surajpur",
  "Surguja",
];
const Goa = ["North Goa", "South Goa"];
const Gujarat = [
  "Ahmedabad",
  "Amreli",
  "Anand",
  "Aravalli",
  "Banaskantha",
  "Bharuch",
  "Bhavnagar",
  "Botad",
  "Chhota Udaipur",
  "Dahod",
  "Dang",
  "Devbhoomi Dwarka",
  "Gandhinagar",
  "Gir Somnath",
  "Jamnagar",
  "Junagadh",
  "Kheda",
  "Kutch",
  "Mahisagar",
  "Mehsana",
  "Morbi",
  "Narmada",
  "Navsari",
  "Panchmahal",
  "Patan",
  "Porbandar",
  "Rajkot",
  "Sabarkantha",
  "Surat",
  "Surendranagar",
  "Tapi",
  "Vadodara",
  "Valsad",
];
const Haryana = [
  "Ambala",
  "Bhiwani",
  "Charkhi Dadri",
  "Faridabad",
  "Fatehabad",
  "Gurugram",
  "Hisar",
  "Jhajjar",
  "Jind",
  "Kaithal",
  "Karnal",
  "Kurukshetra",
  "Mahendragarh",
  "Mewat",
  "Palwal",
  "Panchkula",
  "Panipat",
  "Rewari",
  "Rohtak",
  "Sirsa",
  "Sonipat",
  "Yamunanagar",
];
const HimachalPradesh = [
  "Bilaspur",
  "Chamba",
  "Hamirpur",
  "Kangra",
  "Kinnaur",
  "Kullu",
  "Lahaul Spiti",
  "Mandi",
  "Shimla",
  "Sirmaur",
  "Solan",
  "Una",
];
const JammuKashmir = [
  "Anantnag",
  "Bandipora",
  "Baramulla",
  "Budgam",
  "Doda",
  "Ganderbal",
  "Jammu",
  "Kargil",
  "Kathua",
  "Kishtwar",
  "Kulgam",
  "Kupwara",
  "Leh",
  "Poonch",
  "Pulwama",
  "Rajouri",
  "Ramban",
  "Reasi",
  "Samba",
  "Shopian",
  "Srinagar",
  "Udhampur",
];
const Jharkhand = [
  "Bokaro",
  "Chatra",
  "Deoghar",
  "Dhanbad",
  "Dumka",
  "East Singhbhum",
  "Garhwa",
  "Giridih",
  "Godda",
  "Gumla",
  "Hazaribagh",
  "Jamtara",
  "Khunti",
  "Koderma",
  "Latehar",
  "Lohardaga",
  "Pakur",
  "Palamu",
  "Ramgarh",
  "Ranchi",
  "Sahebganj",
  "Seraikela Kharsawan",
  "Simdega",
  "West Singhbhum",
];
const Karnataka = [
  "Bagalkot",
  "Bangalore Rural",
  "Bangalore Urban",
  "Belgaum",
  "Bellary",
  "Bidar",
  "Vijayapura",
  "Chamarajanagar",
  "Chikkaballapur",
  "Chikkamagaluru",
  "Chitradurga",
  "Dakshina Kannada",
  "Davanagere",
  "Dharwad",
  "Gadag",
  "Gulbarga",
  "Hassan",
  "Haveri",
  "Kodagu",
  "Kolar",
  "Koppal",
  "Mandya",
  "Mysore",
  "Raichur",
  "Ramanagara",
  "Shimoga",
  "Tumkur",
  "Udupi",
  "Uttara Kannada",
  "Yadgir",
];
const Kerala = [
  "Alappuzha",
  "Ernakulam",
  "Idukki",
  "Kannur",
  "Kasaragod",
  "Kollam",
  "Kottayam",
  "Kozhikode",
  "Malappuram",
  "Palakkad",
  "Pathanamthitta",
  "Thiruvananthapuram",
  "Thrissur",
  "Wayanad",
];
const MadhyaPradesh = [
  "Agar Malwa",
  "Alirajpur",
  "Anuppur",
  "Ashoknagar",
  "Balaghat",
  "Barwani",
  "Betul",
  "Bhind",
  "Bhopal",
  "Burhanpur",
  "Chhatarpur",
  "Chhindwara",
  "Damoh",
  "Datia",
  "Dewas",
  "Dhar",
  "Dindori",
  "Guna",
  "Gwalior",
  "Harda",
  "Hoshangabad",
  "Indore",
  "Jabalpur",
  "Jhabua",
  "Katni",
  "Khandwa",
  "Khargone",
  "Mandla",
  "Mandsaur",
  "Morena",
  "Narsinghpur",
  "Neemuch",
  "Panna",
  "Raisen",
  "Rajgarh",
  "Ratlam",
  "Rewa",
  "Sagar",
  "Satna",
  "Sehore",
  "Seoni",
  "Shahdol",
  "Shajapur",
  "Sheopur",
  "Shivpuri",
  "Sidhi",
  "Singrauli",
  "Tikamgarh",
  "Ujjain",
  "Umaria",
  "Vidisha",
];
const Maharashtra = [
  "Ahmednagar",
  "Akola",
  "Amravati",
  "Aurangabad",
  "Beed",
  "Bhandara",
  "Buldhana",
  "Chandrapur",
  "Dhule",
  "Gadchiroli",
  "Gondia",
  "Hingoli",
  "Jalgaon",
  "Jalna",
  "Kolhapur",
  "Latur",
  "Mumbai City",
  "Mumbai Suburban",
  "Nagpur",
  "Nanded",
  "Nandurbar",
  "Nashik",
  "Osmanabad",
  "Palghar",
  "Parbhani",
  "Pune",
  "Raigad",
  "Ratnagiri",
  "Sangli",
  "Satara",
  "Sindhudurg",
  "Solapur",
  "Thane",
  "Wardha",
  "Washim",
  "Yavatmal",
];
const Manipur = [
  "Bishnupur",
  "Chandel",
  "Churachandpur",
  "Imphal East",
  "Imphal West",
  "Jiribam",
  "Kakching",
  "Kamjong",
  "Kangpokpi",
  "Noney",
  "Pherzawl",
  "Senapati",
  "Tamenglong",
  "Tengnoupal",
  "Thoubal",
  "Ukhrul",
];
const Meghalaya = [
  "East Garo Hills",
  "East Jaintia Hills",
  "East Khasi Hills",
  "North Garo Hills",
  "Ri Bhoi",
  "South Garo Hills",
  "South West Garo Hills",
  "South West Khasi Hills",
  "West Garo Hills",
  "West Jaintia Hills",
  "West Khasi Hills",
];
const Mizoram = [
  "Aizawl",
  "Champhai",
  "Kolasib",
  "Lawngtlai",
  "Lunglei",
  "Mamit",
  "Saiha",
  "Serchhip",
];
const Nagaland = [
  "Dimapur",
  "Kiphire",
  "Kohima",
  "Longleng",
  "Mokokchung",
  "Mon",
  "Peren",
  "Phek",
  "Tuensang",
  "Wokha",
  "Zunheboto",
];
const Odisha = [
  "Angul",
  "Balangir",
  "Balasore",
  "Bargarh",
  "Bhadrak",
  "Boudh",
  "Cuttack",
  "Debagarh",
  "Dhenkanal",
  "Gajapati",
  "Ganjam",
  "Jagatsinghpur",
  "Jajpur",
  "Jharsuguda",
  "Kalahandi",
  "Kandhamal",
  "Kendrapara",
  "Kendujhar",
  "Khordha",
  "Koraput",
  "Malkangiri",
  "Mayurbhanj",
  "Nabarangpur",
  "Nayagarh",
  "Nuapada",
  "Puri",
  "Rayagada",
  "Sambalpur",
  "Subarnapur",
  "Sundergarh",
];
const Punjab = [
  "Amritsar",
  "Barnala",
  "Bathinda",
  "Faridkot",
  "Fatehgarh Sahib",
  "Fazilka",
  "Firozpur",
  "Gurdaspur",
  "Hoshiarpur",
  "Jalandhar",
  "Kapurthala",
  "Ludhiana",
  "Mansa",
  "Moga",
  "Mohali",
  "Muktsar",
  "Pathankot",
  "Patiala",
  "Rupnagar",
  "Sangrur",
  "Shaheed Bhagat Singh Nagar",
  "Tarn Taran",
];
const Rajasthan = [
  "Ajmer",
  "Alwar",
  "Banswara",
  "Baran",
  "Barmer",
  "Bharatpur",
  "Bhilwara",
  "Bikaner",
  "Bundi",
  "Chittorgarh",
  "Churu",
  "Dausa",
  "Dholpur",
  "Dungarpur",
  "Ganganagar",
  "Hanumangarh",
  "Jaipur",
  "Jaisalmer",
  "Jalore",
  "Jhalawar",
  "Jhunjhunu",
  "Jodhpur",
  "Karauli",
  "Kota",
  "Nagaur",
  "Pali",
  "Pratapgarh",
  "Rajsamand",
  "Sawai Madhopur",
  "Sikar",
  "Sirohi",
  "Tonk",
  "Udaipur",
];
const Sikkim = ["East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"];
const TamilNadu = [
  "Ariyalur",
  "Chennai",
  "Coimbatore",
  "Cuddalore",
  "Dharmapuri",
  "Dindigul",
  "Erode",
  "Kanchipuram",
  "Kanyakumari",
  "Karur",
  "Krishnagiri",
  "Madurai",
  "Nagapattinam",
  "Namakkal",
  "Nilgiris",
  "Perambalur",
  "Pudukkottai",
  "Ramanathapuram",
  "Salem",
  "Sivaganga",
  "Thanjavur",
  "Theni",
  "Thoothukudi",
  "Tiruchirappalli",
  "Tirunelveli",
  "Tiruppur",
  "Tiruvallur",
  "Tiruvannamalai",
  "Tiruvarur",
  "Vellore",
  "Viluppuram",
  "Virudhunagar",
];
const Telangana = [
  "Adilabad",
  "Bhadradri Kothagudem",
  "Hyderabad",
  "Jagtial",
  "Jangaon",
  "Jayashankar",
  "Jogulamba",
  "Kamareddy",
  "Karimnagar",
  "Khammam",
  "Komaram Bheem",
  "Mahabubabad",
  "Mahbubnagar",
  "Mancherial",
  "Medak",
  "Medchal",
  "Nagarkurnool",
  "Nalgonda",
  "Nirmal",
  "Nizamabad",
  "Peddapalli",
  "Rajanna Sircilla",
  "Ranga Reddy",
  "Sangareddy",
  "Siddipet",
  "Suryapet",
  "Vikarabad",
  "Wanaparthy",
  "Warangal Rural",
  "Warangal Urban",
  "Yadadri Bhuvanagiri",
];
const Tripura = [
  "Dhalai",
  "Gomati",
  "Khowai",
  "North Tripura",
  "Sepahijala",
  "South Tripura",
  "Unakoti",
  "West Tripura",
];
const UttarPradesh = [
  "Agra",
  "Aligarh",
  "Allahabad",
  "Ambedkar Nagar",
  "Amethi",
  "Amroha",
  "Auraiya",
  "Azamgarh",
  "Baghpat",
  "Bahraich",
  "Ballia",
  "Balrampur",
  "Banda",
  "Barabanki",
  "Bareilly",
  "Basti",
  "Bhadohi",
  "Bijnor",
  "Budaun",
  "Bulandshahr",
  "Chandauli",
  "Chitrakoot",
  "Deoria",
  "Etah",
  "Etawah",
  "Faizabad",
  "Farrukhabad",
  "Fatehpur",
  "Firozabad",
  "Gautam Buddha Nagar",
  "Ghaziabad",
  "Ghazipur",
  "Gonda",
  "Gorakhpur",
  "Hamirpur",
  "Hapur",
  "Hardoi",
  "Hathras",
  "Jalaun",
  "Jaunpur",
  "Jhansi",
  "Kannauj",
  "Kanpur Dehat",
  "Kanpur Nagar",
  "Kasganj",
  "Kaushambi",
  "Kheri",
  "Kushinagar",
  "Lalitpur",
  "Lucknow",
  "Maharajganj",
  "Mahoba",
  "Mainpuri",
  "Mathura",
  "Mau",
  "Meerut",
  "Mirzapur",
  "Moradabad",
  "Muzaffarnagar",
  "Pilibhit",
  "Pratapgarh",
  "Raebareli",
  "Rampur",
  "Saharanpur",
  "Sambhal",
  "Sant Kabir Nagar",
  "Shahjahanpur",
  "Shamli",
  "Shravasti",
  "Siddharthnagar",
  "Sitapur",
  "Sonbhadra",
  "Sultanpur",
  "Unnao",
  "Varanasi",
];
const Uttarakhand = [
  "Almora",
  "Bageshwar",
  "Chamoli",
  "Champawat",
  "Dehradun",
  "Haridwar",
  "Nainital",
  "Pauri",
  "Pithoragarh",
  "Rudraprayag",
  "Tehri",
  "Udham Singh Nagar",
  "Uttarkashi",
];
const WestBengal = [
  "Alipurduar",
  "Bankura",
  "Birbhum",
  "Cooch Behar",
  "Dakshin Dinajpur",
  "Darjeeling",
  "Hooghly",
  "Howrah",
  "Jalpaiguri",
  "Jhargram",
  "Kalimpong",
  "Kolkata",
  "Malda",
  "Murshidabad",
  "Nadia",
  "North 24 Parganas",
  "Paschim Bardhaman",
  "Paschim Medinipur",
  "Purba Bardhaman",
  "Purba Medinipur",
  "Purulia",
  "South 24 Parganas",
  "Uttar Dinajpur",
];
const AndamanNicobar = ["Nicobar", "North Middle Andaman", "South Andaman"];
const Chandigarh = ["Chandigarh"];
const DadraHaveli = ["Dadra Nagar Haveli"];
const DamanDiu = ["Daman", "Diu"];
const Delhi = [
  "Central Delhi",
  "East Delhi",
  "New Delhi",
  "North Delhi",
  "North East Delhi",
  "North West Delhi",
  "Shahdara",
  "South Delhi",
  "South East Delhi",
  "South West Delhi",
  "West Delhi",
];
const Lakshadweep = ["Lakshadweep"];
const Puducherry = ["Karaikal", "Mahe", "Puducherry", "Yanam"];

// List of all states
const statesList = [
  "Andra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttarakhand",
  "Uttar Pradesh",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli",
  "Daman and Diu",
  "Delhi",
  "Lakshadweep",
  "Puducherry",
];

export default function NewEnquiryLayer() {
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [section, setSection] = useState([]);
  const [classData, setClassData] = useState([]);

  const initialFormData = {
    stream: "",
    firstName: "",
    lastName: "",
    gender: "",
    mobile: "",
    email: "",
    classYear: "",
    classId: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    description: "",
  };

  const [formData, setFormData] = useState({
    stream: "",
    firstName: "",
    lastName: "",
    gender: "",
    mobile: "",
    email: "",
    classYear: "",
    classId: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    description: "",
  });

  // fetch Sections
  useEffect(() => {
    const fetchSection = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_LOCAL_API_URL}enquiry/section`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.data.success) {
          setSection(response.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSection();
  }, []);

  // fetch class
  useEffect(() => {
    const fetchClass = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_LOCAL_API_URL}enquiry/class?section=${
            formData.stream
          }`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.data.success) {
          setClassData(response.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchClass();
  }, [formData.stream]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Special handler for class selection that stores both name and ID
  const handleClassSelect = (classObj) => {
    setFormData((prev) => ({
      ...prev,
      classYear: classObj.class, // or whatever property shows the class name
      classId: classObj.id, // store the class ID
    }));
  };

  const handleSelectChange = (name, value) => {
    if (name === "state") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        city: "", // Reset city when state changes
      }));

      // Update cities based on selected state
      switch (value) {
        case "Andra Pradesh":
          setCities(AndraPradesh);
          break;
        case "Arunachal Pradesh":
          setCities(ArunachalPradesh);
          break;
        case "Assam":
          setCities(Assam);
          break;
        case "Bihar":
          setCities(Bihar);
          break;
        case "Chhattisgarh":
          setCities(Chhattisgarh);
          break;
        case "Goa":
          setCities(Goa);
          break;
        case "Gujarat":
          setCities(Gujarat);
          break;
        case "Haryana":
          setCities(Haryana);
          break;
        case "Himachal Pradesh":
          setCities(HimachalPradesh);
          break;
        case "Jammu and Kashmir":
          setCities(JammuKashmir);
          break;
        case "Jharkhand":
          setCities(Jharkhand);
          break;
        case "Karnataka":
          setCities(Karnataka);
          break;
        case "Kerala":
          setCities(Kerala);
          break;
        case "Madhya Pradesh":
          setCities(MadhyaPradesh);
          break;
        case "Maharashtra":
          setCities(Maharashtra);
          break;
        case "Manipur":
          setCities(Manipur);
          break;
        case "Meghalaya":
          setCities(Meghalaya);
          break;
        case "Mizoram":
          setCities(Mizoram);
          break;
        case "Nagaland":
          setCities(Nagaland);
          break;
        case "Odisha":
          setCities(Odisha);
          break;
        case "Punjab":
          setCities(Punjab);
          break;
        case "Rajasthan":
          setCities(Rajasthan);
          break;
        case "Sikkim":
          setCities(Sikkim);
          break;
        case "Tamil Nadu":
          setCities(TamilNadu);
          break;
        case "Telangana":
          setCities(Telangana);
          break;
        case "Tripura":
          setCities(Tripura);
          break;
        case "Uttarakhand":
          setCities(Uttarakhand);
          break;
        case "Uttar Pradesh":
          setCities(UttarPradesh);
          break;
        case "West Bengal":
          setCities(WestBengal);
          break;
        case "Andaman and Nicobar Islands":
          setCities(AndamanNicobar);
          break;
        case "Chandigarh":
          setCities(Chandigarh);
          break;
        case "Dadra and Nagar Haveli":
          setCities(DadraHaveli);
          break;
        case "Daman and Diu":
          setCities(DamanDiu);
          break;
        case "Delhi":
          setCities(Delhi);
          break;
        case "Lakshadweep":
          setCities(Lakshadweep);
          break;
        case "Puducherry":
          setCities(Puducherry);
          break;
        default:
          setCities([]);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_LOCAL_API_URL}enquiry/create-enquiry`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data.success) {
        Toast.showSuccessToast(response.data.message);
        setFormData(initialFormData);
      }
    } catch (error) {
      if (error.response) {
        Toast.showWarningToast(`${error.response.data.message}`);
        console.log(error.response.data.message);
      } else if (error.request) {
        Toast.showErrorToast("Sorry, our server is down");
      } else {
        Toast.showErrorToast("Sorry, please try again later");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center py-3 border-b mb-3">
        <div className="flex items-center gap-2">
          <FileEdit className="h-5 w-5 text-orange-500" />
          <h1 className="text-xl font-medium">New Enquiry</h1>
        </div>
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-center">
            <Label htmlFor="stream" className="w-24 text-right pr-4">
              Stream <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.stream}
              onValueChange={(value) => handleSelectChange("stream", value)}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select stream" />
              </SelectTrigger>
              <SelectContent>
                {section.map((item) => (
                  <SelectItem key={item.category} value={item.category}>
                    {item.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center">
            <Label htmlFor="classYear" className="w-24 text-right pr-4">
              Class/Year <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.classYear}
              onValueChange={(value) => {
                // Find the full class object to get the ID
                const selectedClass = classData.find(
                  (cls) => cls.class === value
                );
                handleClassSelect(selectedClass);
              }}
              disabled={!formData.stream} // Disable until stream is selected
            >
              <SelectTrigger className="flex-1 text-slate-900">
                <SelectValue
                  placeholder={
                    formData.stream ? "Select class" : "Select stream first"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {classData.map((cls) => (
                  <SelectItem key={cls.id} value={cls.class}>
                    {cls.class}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-center">
            <Label htmlFor="firstName" className="w-24 text-right pr-4">
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="flex-1"
            />
          </div>
          <div className="flex items-center">
            <Label htmlFor="lastName" className="w-24 text-right pr-4">
              Last Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="flex-1"
            />
          </div>
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-center">
            <Label htmlFor="gender" className="w-24 text-right pr-4">
              Gender <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => handleSelectChange("gender", value)}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center">
            <Label htmlFor="dateOfBirth" className="w-24 text-right">
              Date of Birth <span className="text-red-500">*</span>
            </Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="flex-1"
            />
          </div>
        </div>

        {/* Fourth Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-center">
            <Label htmlFor="mobile" className="w-24 text-right pr-4">
              Mobile <span className="text-red-500">*</span>
            </Label>
            <Input
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="flex-1"
            />
          </div>
          <div className="flex items-center">
            <Label htmlFor="email" className="w-24 text-right pr-4">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="flex-1"
            />
          </div>
        </div>

        {/* Sixth Row - State and City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-center">
            <Label htmlFor="state" className="w-24 text-right pr-4">
              State <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.state}
              onValueChange={(value) => handleSelectChange("state", value)}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {statesList.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center">
            <Label htmlFor="city" className="w-24 text-right pr-4">
              City
            </Label>
            <Select
              value={formData.city}
              onValueChange={(value) => handleSelectChange("city", value)}
              disabled={!formData.state}
            >
              <SelectTrigger className="flex-1">
                <SelectValue
                  placeholder={
                    formData.state ? "Select city" : "Select state first"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Fifth Row - Address */}
        <div className="mb-6">
          <div className="flex items-center">
            <Label htmlFor="address" className="w-24 text-right pr-4">
              Address
            </Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="flex-1"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <div className="flex items-start">
            <Label htmlFor="description" className="w-24 text-right pr-4 pt-2">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="flex-1 min-h-[100px]"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-8">
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-md"
          >
            Submit Enquiry
          </Button>
        </div>
      </form>
    </div>
  );
}
