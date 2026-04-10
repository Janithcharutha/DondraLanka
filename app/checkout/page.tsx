"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCart } from "@/components/providers/cart-provider"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { format } from 'date-fns'

interface BillingDetails {
  firstName: string
  lastName: string
  companyName: string
  country: string
  streetAddress: string
  addressLine2: string
  city: string
  phoneNumber: string
  email: string
  orderNotes: string
  paymentProof?: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const [checkoutData, setCheckoutData] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [paymentProof, setPaymentProof] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [orderReference, setOrderReference] = useState<string | null>(null)

  const bankDetails = {
    bankName: "National Savings Bank",
    accountName: "DONDRA LANKA",
    accountNumber: "100390217204",
    branch: "Devinuwara",
    swiftCode: "NSBALKLX"
  }
  
  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    firstName: "",
    lastName: "",
    companyName: "",
    country: "Sri Lanka",
    streetAddress: "",
    addressLine2: "",
    city: "",
    phoneNumber: "",
    email: "",
    orderNotes: ""
  })

  useEffect(() => {
    const savedCheckout = localStorage.getItem('checkoutItems')
    if (!savedCheckout) {
      router.push('/cart')
      return
    }

    const parsedCheckout = JSON.parse(savedCheckout)
    setCheckoutData(parsedCheckout)
  }, [router])

  useEffect(() => {
    if (paymentMethod === 'bank-transfer' && billingDetails.firstName && billingDetails.lastName) {
      // Create reference using first and last name only
      const firstName = billingDetails.firstName.toUpperCase()
      const lastName = billingDetails.lastName.toUpperCase()
      const reference = `${firstName} ${lastName}`
      setOrderReference(reference)
    }
  }, [paymentMethod, billingDetails.firstName, billingDetails.lastName])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBillingDetails(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const { url } = await response.json()
      setPaymentProof(url)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload payment proof",
        variant: "destructive"
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    try {
      setIsSubmitting(true)

      // Validate payment proof for bank transfer
      if (paymentMethod === 'bank-transfer' && !paymentProof) {
        toast({
          title: "Error",
          description: "Please upload payment proof for bank transfer",
          variant: "destructive",
        })
        return
      }

      const orderData = {
        orderNumber: `ORD-${format(new Date(), 'ddMM-HHmm')}`,
        userId: `guest-${Date.now()}`,
        billingDetails,
        items: checkoutData.items,
        total: checkoutData.total,
        paymentMethod,
        status: 'pending',
        // Include payment proof only for bank transfer
        ...(paymentMethod === 'bank-transfer' && {
          paymentProof: paymentProof,
          orderReference: `${billingDetails.firstName} ${billingDetails.lastName}`.toUpperCase()
        })
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      if (response.ok) {
        const data = await response.json()
        clearCart()
        router.push(`/order-confirmation/${data.orderNumber}`)
      }

    } catch (error) {
      console.error('Error creating order:', error)
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!checkoutData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Loading...
      </div>
    )
  }

  const BankTransferDetails = () => (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Bank Transfer Details</AlertTitle>
      <AlertDescription>
        <div className="mt-2 space-y-2">
          <p><strong>Bank:</strong> {bankDetails.bankName}</p>
          <p><strong>Account Name:</strong> {bankDetails.accountName}</p>
          <p><strong>Account Number:</strong> {bankDetails.accountNumber}</p>
          <p><strong>Branch:</strong> {bankDetails.branch}</p>
          <p><strong>Swift Code:</strong> {bankDetails.swiftCode}</p>
          {billingDetails.firstName && billingDetails.lastName ? (
            <div className="mt-2">
              <p className="text-sm text-gray-500">Set Your Transfer Reference as</p>
              <p className="text-lg font-semibold text-red-600">
                {orderReference}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                This reference is generated from your name for easy tracking
              </p>
            </div>
          ) : (
            <p className="mt-2 text-amber-600 text-sm">
              Please fill in your name to generate your transfer reference
            </p>
          )}
          <p className="text-sm text-gray-500">
            Please use this reference number when making the bank transfer
          </p>
        </div>
      </AlertDescription>
    </Alert>
  )

  return (
    <form onSubmit={handleSubmit} className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Billing Details</h2>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="firstName"
                placeholder="First name"
                value={billingDetails.firstName}
                onChange={handleInputChange}
                required
              />
              <Input
                name="lastName"
                placeholder="Last name"
                value={billingDetails.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            <Input
              name="companyName"
              placeholder="Company name (optional)"
              value={billingDetails.companyName}
              onChange={handleInputChange}
            />
            <Input
              name="country"
              placeholder="Country"
              value="Sri Lanka"
              disabled
            />
            <Input
              name="streetAddress"
              placeholder="Street address"
              value={billingDetails.streetAddress}
              onChange={handleInputChange}
              required
            />
            <Input
              name="addressLine2"
              placeholder="Address line 2"
              value={billingDetails.addressLine2}
              onChange={handleInputChange}
            />
            <Select
              name="city"
              value={billingDetails.city}
              onValueChange={(value) => 
                setBillingDetails(prev => ({ ...prev, city: value }))
              }
              required
            >
              <SelectTrigger className={!billingDetails.city ? 'border-red-300' : ''}>
                {billingDetails.city || 'Select your city for delivery *'}
              </SelectTrigger>
              <SelectContent>
  <SelectItem value="akkaraipattu">Akkaraipattu</SelectItem>
  <SelectItem value="ambalangoda">Ambalangoda</SelectItem>
  <SelectItem value="ampara">Ampara</SelectItem>
  <SelectItem value="anuradhapura">Anuradhapura</SelectItem>
  <SelectItem value="badulla">Badulla</SelectItem>
  <SelectItem value="balangoda">Balangoda</SelectItem>
  <SelectItem value="bandarawela">Bandarawela</SelectItem>
  <SelectItem value="batticaloa">Batticaloa</SelectItem>
  <SelectItem value="beruwala">Beruwala</SelectItem>
  <SelectItem value="boralesgamuwa">Boralesgamuwa</SelectItem>
  <SelectItem value="chavakachcheri">Chavakachcheri</SelectItem>
  <SelectItem value="chilaw">Chilaw</SelectItem>
  <SelectItem value="colombo">Colombo</SelectItem>
  <SelectItem value="dambulla">Dambulla</SelectItem>
  <SelectItem value="dehiwala-mount-lavinia">Dehiwala-Mount Lavinia</SelectItem>
  <SelectItem value="embilipitiya">Embilipitiya</SelectItem>
  <SelectItem value="eravur">Eravur</SelectItem>
  <SelectItem value="galle">Galle</SelectItem>
  <SelectItem value="gampaha">Gampaha</SelectItem>
  <SelectItem value="gampola">Gampola</SelectItem>
  <SelectItem value="hambantota">Hambantota</SelectItem>
  <SelectItem value="haputale">Haputale</SelectItem>
  <SelectItem value="hatton-dickoya">Hatton-Dickoya</SelectItem>
  <SelectItem value="hikkaduwa">Hikkaduwa</SelectItem>
  <SelectItem value="horana">Horana</SelectItem>
  <SelectItem value="ja-ela">Ja-Ela</SelectItem>
  <SelectItem value="jaffna">Jaffna</SelectItem>
  <SelectItem value="kadugannawa">Kadugannawa</SelectItem>
  <SelectItem value="kaduwela-battaramulla">Kaduwela (Battaramulla)</SelectItem>
  <SelectItem value="kalmunai-sainthamarathu">Kalmunai (incl. Sainthamarathu)</SelectItem>
  <SelectItem value="kalutara">Kalutara</SelectItem>
  <SelectItem value="kandy">Kandy</SelectItem>
  <SelectItem value="kattankudy">Kattankudy (Kathankudi)</SelectItem>
  <SelectItem value="katunayake-seeduwa">Katunayake (-Seeduwa)</SelectItem>
  <SelectItem value="kegalle">Kegalle</SelectItem>
  <SelectItem value="kesbewa">Kesbewa</SelectItem>
  <SelectItem value="kilinochchi">Kilinochchi</SelectItem>
  <SelectItem value="kinniya">Kinniya</SelectItem>
  <SelectItem value="kolonnawa">Kolonnawa</SelectItem>
  <SelectItem value="kuliyapitiya">Kuliyapitiya</SelectItem>
  <SelectItem value="kurunegala">Kurunegala</SelectItem>
  <SelectItem value="maharagama">Maharagama</SelectItem>
  <SelectItem value="mannar">Mannar</SelectItem>
  <SelectItem value="matale">Matale</SelectItem>
  <SelectItem value="matara">Matara</SelectItem>
  <SelectItem value="minuwangoda">Minuwangoda</SelectItem>
  <SelectItem value="moneragala">Moneragala</SelectItem>
  <SelectItem value="moratuwa">Moratuwa</SelectItem>
  <SelectItem value="mullaitivu">Mullaitivu</SelectItem>
  <SelectItem value="nawalapitiya">Nawalapitiya</SelectItem>
  <SelectItem value="negombo">Negombo</SelectItem>
  <SelectItem value="nuwara-eliya">Nuwara Eliya</SelectItem>
  <SelectItem value="panadura">Panadura</SelectItem>
  <SelectItem value="peliyagoda">Peliyagoda</SelectItem>
  <SelectItem value="point-pedro">Point Pedro</SelectItem>
  <SelectItem value="polonnaruwa">Polonnaruwa</SelectItem>
  <SelectItem value="puttalam">Puttalam</SelectItem>
  <SelectItem value="ratnapura">Ratnapura</SelectItem>
  <SelectItem value="seethawakapura-avissawella">Seethawakapura (Avissawella)</SelectItem>
  <SelectItem value="sri-jayawardenepura-kotte">Sri Jayawardenepura (Kotte)</SelectItem>
  <SelectItem value="tangalle">Tangalle</SelectItem>
  <SelectItem value="thalawakela-lindula">ThalawakelæLindula</SelectItem>
  <SelectItem value="trincomalee">Trincomalee</SelectItem>
  <SelectItem value="valvettithurai">Valvettithurai</SelectItem>
  <SelectItem value="vavuniya">Vavuniya</SelectItem>
  <SelectItem value="wattala-mabole">Wattala-Mabole</SelectItem>
  <SelectItem value="wattegama">Wattegama</SelectItem>
  <SelectItem value="weligama">Weligama</SelectItem>
</SelectContent>

                          

            </Select>
            {!billingDetails.city && (
              <p className="text-sm text-red-500 mt-1">
                Please select your city for delivery
              </p>
            )}
            <Input
              name="phoneNumber"
              placeholder="Phone"
              value={billingDetails.phoneNumber}
              onChange={handleInputChange}
              required
            />
            <Input
              name="email"
              type="email"
              placeholder="Email address"
              value={billingDetails.email}
              onChange={handleInputChange}
              required
            />
            <Textarea
              name="orderNotes"
              placeholder="Notes about your order, e.g. special notes for delivery."
              value={billingDetails.orderNotes}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-4">Your Order</h2>
              {checkoutData.items.map((item: any) => (
                <div key={item.itemId} className="border-b py-2 flex justify-between">
                  <span>{item.name} × {item.quantity}</span>
                  <span>Rs.{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="py-2 flex justify-between">
                <span>Subtotal</span>
                <span>Rs.{checkoutData.total.toLocaleString()}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span>Shipping</span>
                <span className="text-gray-500">Rs.350</span>
              </div>
              <div className="py-2 flex justify-between font-bold">
                <span>Total</span>
                 <span>Rs.{(350 + checkoutData.total).toLocaleString()}</span>
              </div>

              

              <RadioGroup 
                value={paymentMethod} 
                onValueChange={setPaymentMethod} 
                className="mt-4 space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod">Cash on delivery</Label>
                </div>
                {/* <div className="flex items-center space-x-2">
                  <RadioGroupItem value="payhere" id="payhere" />
                  <Label htmlFor="payhere">PayHere</Label>
                </div> */}
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                  <Label htmlFor="mintpay">Bank Transfer</Label>
                </div>
              </RadioGroup>

              {paymentMethod === 'bank-transfer' && (
                <div className="mt-4 space-y-4">
                  <BankTransferDetails />

                  <div className="space-y-2">
                    <Label htmlFor="paymentProof" className="flex items-center justify-between">
                      Upload Payment Proof
                      <span className="text-sm text-red-500">*Required</span>
                    </Label>
                    <Input
                      id="paymentProof"
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className={`cursor-pointer ${!paymentProof ? 'border-red-300' : 'border-green-300'}`}
                      required
                    />
                    {!paymentProof && (
                      <p className="text-sm text-red-500">
                        Please upload your payment proof to complete the order
                      </p>
                    )}
                    {paymentProof && (
                      <div className="relative h-40 w-full mt-2">
                        <Image
                          src={paymentProof}
                          alt="Payment proof"
                          fill
                          className="object-contain"
                        />
                        <p className="text-sm text-green-600 mt-2">
                          ✓ Payment proof uploaded successfully
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full mt-4" 
                disabled={
                  isSubmitting || 
                  (paymentMethod === 'bank-transfer' && !paymentProof)
                }
              >
                {isSubmitting 
                  ? "Processing..." 
                  : paymentMethod === 'bank-transfer' && !paymentProof 
                    ? "Upload Payment Proof to Continue" 
                    : "Place Order"
                }
              </Button>
              
              <p className="mt-2 text-xs text-gray-500">
                Your personal data will be used to process your order, support your experience 
                throughout this website, and for other purposes described in our privacy policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}