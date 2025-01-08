"use client" // include with Next.js 13+

import { useState } from "react"
import { Heading } from "@medusajs/ui"
import { Select } from "@medusajs/ui"
import axios from "axios"

export default function Register() {
  const [loading, setLoading] = useState(false)
  const [idType, setIdType] = useState("")
  const [id, setId] = useState("")
  const [isEInvoice, setIsEInvoice] = useState(false)
  const [error, setError] = useState("")
  
  const idTypeOptions = [
    {
      value: "tckn",
      label: "TC Kimlik Numarası",
    },
    {
      value: "vkn",
      label: "Vergi Kimlik Numarası",
    }
  ];  
  const validateId = (type: string, value: string) => {
    if (type === "vkn" && value.length !== 10) {
      setError("Vergi Kimlik Numarası 10 haneli olmalıdır.")
      return false
    }
    if (type === "tckn" && value.length !== 11) {
      setError("TC Kimlik Numarası 11 haneli olmalıdır.")
      return false
    }
    setError("")
    return true
  }
  
  const handleRegistration = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault()
    if (!idType || !id) {
      setError("Lütfen tüm alanları doldurunuz")
      return
    }
  
    if (!validateId(idType, id)) {
      return
    }
  
    setLoading(true)
  
    try {
      const response = await axios.post(
        `/api/admin/customers`,
        {
          email: `${id}@faturaturka.com`,
          metadata: {
            idType: idType,
            id: id,
            isEInvoice: isEInvoice,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_MEDUSA_ADMIN_API_KEY}`,
          },
        }
      )
  
      console.log("Müşteri başarıyla oluşturuldu:", response.data.customer)
      
      setError("")
      setId("")
      setIdType("")
      setIsEInvoice(false)
  
    } catch (error: any) {
      console.error(error)
      setError(error.response?.data?.message || "Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }
  

  return (
    <div className="p-8 mt-10 max-w-md mx-auto bg-white rounded-lg shadow-lg">
    <div className="flex justify-center items-center mb-6">
      <Heading level="h1">Yeni Müşteri Ekle</Heading>
    </div>
    <form className="flex flex-col items-center justify-center gap-4 w-full max-w-md mx-auto">
  
    <div className="w-full">
      <Select onValueChange={(value) => setIdType(value)}>
        <Select.Trigger className="p-2 bg-white shadow-none border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
          <Select.Value placeholder="Kimlik Tipi Seçiniz" />
        </Select.Trigger>
        <Select.Content>
          {idTypeOptions.map((item) => (
            <Select.Item key={item.value} value={item.value}>
              {item.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </div>


      { idType && (
      <input 
        type="text" 
        name="id"
        value={id}
        placeholder={idType === "vkn" ? "VKN (10 haneli)" : "TCKN (11 haneli)"}
        onChange={(e) => {
          const value = e.target.value.replace(/[^0-9]/g, "")
          setId(value)
          validateId(idType, value)
        }}
        maxLength={idType === "vkn" ? 10 : 11}
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      )}
      
      <div className="flex items-center gap-2 w-full">
        <input
          type="checkbox"
          id="isEInvoice"
          checked={isEInvoice}
          onChange={(e) => setIsEInvoice(e.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor="isEInvoice" className="text-gray-700 mt-3.5 cursor-pointer">
          E-Fatura Kullanıcısı
        </label>
      </div>

      {error && (
        <div className="text-red-500 w-full text-center">
          {error}
        </div>
      )}

      <button
        disabled={loading}
        onClick={handleRegistration}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "İşleniyor..." : "Kaydet"}
      </button>
    </form>
  </div>
  )
}