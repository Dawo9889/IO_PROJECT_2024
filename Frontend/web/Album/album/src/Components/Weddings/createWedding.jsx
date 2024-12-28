import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ArrowLeftIcon, CalendarIcon } from '@heroicons/react/24/solid';
import './style.css'
import '../Spinner/Spinner.css'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateWedding = () => {

    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    var curr = new Date();
    curr.setDate(curr.getDate() + 3);
    var inputDate = curr.toISOString().substring(0,10)

    const openDatePicker = () => {
      document.getElementById("date").showPicker();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const authData = JSON.parse(localStorage.getItem("auth"));
        const accessToken = authData?.accessToken;
        setLoading(true)
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/wedding`,
                {
                    name: name,
                    eventDate: date,
                    description: description,

                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );
            setLoading(false)
            toast.success('Wedding created successfully!');
            setTimeout(() => {
              navigate(-1);
            }, 1000);

        }
        catch(err) {
            console.error(err);
            toast.error('An error occurred while creating the wedding.')
        }
    }

    useEffect(() => {
      if (name.trim() && date.trim() && description.trim()) {
        setIsFormValid(true);
      } else {
        setIsFormValid(false);
      }
    }, [name, date, description]);

    useEffect(() => {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0]; 
      setDate(formattedDate);
    }, []);

  return (
<div className='grid grid-cols-1 md:grid-cols-3 gap-4 p-4'>
<div className="p-4 order-1 md:order-1 w-full max-w-md justify-items-end">

<a 
  className="relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium rounded-lg hover:bg-project-dark-bg sm:p-2 sm:mb-3 md:p-4 md:mb-4" 
  href="/admin"
>
  <ArrowLeftIcon className="w-6 h-6 text-white sm:w-8 sm:h-8 md:w-10 md:h-10" />
</a>
</div>
<div className="order-2 md:order-2 w-full max-w-md mx-auto bg-project-dark-bg rounded-lg shadow-lg p-4">
<h1 className="text-2xl text-white font-bold text-center mb-4">Create Wedding</h1>
<form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 " autoComplete="off">
  <div className="relative z-0 w-full mb-5 group">
  <input 
        type="text" 
        name="name" 
        id="name" 
        className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-project-blue peer"
        placeholder=" "
        onChange={(e) => setName(e.target.value)}
        value={name} 
        required 
      />
  <label 
    className="peer-focus:font-medium absolute text-sm text-project-blue duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-project-blue peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
    Name
  </label>
</div>
<div className="relative z-0 w-full mb-5 group">
  <input 
    type="date"
    name="date" 
    id="date" 
    className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-project-blue peer" 
    onChange={(e) => setDate(e.target.value)}
    value={date}
    required 
  />
  <CalendarIcon 
  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white" 
  onClick={openDatePicker}
  /> 
  <label 
    htmlFor="date"
    className="peer-focus:font-medium absolute text-sm text-project-blue duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-project-blue peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
    Date
  </label>
</div>
<div className="relative z-0 w-full mb-5 group">
  <input 
    type="text" 
    name="floating_text" 
    id="floating_text" 
    className="block py-2.5 px-0 w-full text-sm text-project-blue bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-project-blue peer" 
    onChange={(e) => setDescription(e.target.value)}
    value={description} 
    placeholder=" " 
    required 
  />
  <label 
    className="peer-focus:font-medium absolute text-sm text-project-blue duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-project-blue peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
    Description
  </label>
</div>
<div className="flex justify-center">
{loading ? (
  <div className="loader border-t-4 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
) : (
  <>
    {message && (
      <p className="m-4 text-center text-sm text-project-yellow">{message}</p>
    )}
    {isFormValid ? (
      <button
        type="submit"
        className="w-full relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium rounded-lg border 
                   border-project-yellow bg-project-yellow text-dark group focus:outline-none focus:ring-2 
                   focus:ring-project-yellow"
      >
        <span className="relative py-2.5 px-5 transition-all ease-in duration-200">
          Submit
        </span>
      </button>
    ) : (
      <button
        type="submit"
        className="w-full relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium rounded-lg border 
                   border-project-yellow bg-project-dark text-white group focus:outline-none focus:ring-2 
                   focus:ring-project-yellow"
        disabled
      >
        <span className="relative py-2.5 px-5 transition-all ease-in duration-200">
          Submit
        </span>
      </button>
    )}
  </>
)}
</div>

</form>
</div>
<div className="order-3 md:order-3 w-full max-w-md"></div>
</div>
  )
}

export default CreateWedding