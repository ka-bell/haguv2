"use client"

import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Search,
  User,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Calendar,
} from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useBookings } from "../../lib/bookings-context"
import Link from "next/link"

export default function ServiceSelection() {
  const router = useRouter()
  const { addBooking } = useBookings()

  const [selectedServices, setSelectedServices] = useState<string[]>(["TV watching", "Hugging"])
  const [sliderValues, setSliderValues] = useState<{ [key: string]: number }>({
    "TV watching": 60,
    Hugging: 60,
  })
  const [showDateTimeModal, setShowDateTimeModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<number | null>(1)
  const [selectedTime, setSelectedTime] = useState<string | null>("12:00")
  const [selectedEndTime, setSelectedEndTime] = useState<string | null>("14:00")
  const [currentMonth, setCurrentMonth] = useState("February")
  const [currentYear, setCurrentYear] = useState(2024)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [selectedLocations, setSelectedLocations] = useState<string[]>(["My place"])

  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false)

  const services = [
    { name: "TV watching", basePrice: 80, hasSlider: true },
    { name: "Hugging", basePrice: 85, hasSlider: true },
    { name: "Back scratching", basePrice: 120, hasSlider: false },
    { name: "Co-sleep", basePrice: 80, hasSlider: false },
    { name: "Cooking", basePrice: 95, hasSlider: false },
    { name: "Reading", basePrice: 75, hasSlider: false },
  ]

  const calendarDates = [
    { date: 1, available: true, selected: true },
    { date: 2, available: false },
    { date: 3, available: false },
    { date: 4, available: true },
    { date: 5, available: false },
    { date: 6, available: false },
    { date: 7, available: true },
    { date: 8, available: true },
    { date: 9, available: true },
    { date: 10, available: false },
    { date: 11, available: true },
    { date: 12, available: true },
    { date: 13, available: false },
    { date: 14, available: true },
    { date: 15, available: true },
    { date: 16, available: true },
    { date: 17, available: false },
    { date: 18, available: true },
    { date: 19, available: true },
    { date: 20, available: false },
    { date: 21, available: true },
    { date: 22, available: true },
    { date: 23, available: true },
    { date: 24, available: false },
    { date: 25, available: true },
    { date: 26, available: true },
    { date: 27, available: false },
    { date: 28, available: true },
    { date: 29, available: true },
    { date: 30, available: true },
    { date: 31, available: false },
  ]

  const timeSlots = ["10:00", "11:00", "12:00", "13:00", "15:00", "16:00", "17:00"]

  const locationOptions = ["Hagu's place", "My place", "In public", "No preference"]

  const toggleService = (serviceName: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceName) ? prev.filter((s) => s !== serviceName) : [...prev, serviceName],
    )
  }

  const updateSliderValue = (serviceName: string, value: number) => {
    setSliderValues((prev) => ({
      ...prev,
      [serviceName]: value,
    }))
  }

  const toggleLocation = (location: string) => {
    setSelectedLocations((prev) => (prev.includes(location) ? prev.filter((l) => l !== location) : [...prev, location]))
  }

  const getServicePrice = (service: (typeof services)[0]) => {
    if (!selectedServices.includes(service.name)) {
      return `${service.basePrice} € / per h`
    }
    if (service.hasSlider && sliderValues[service.name] > 0) {
      const pricePerHour = service.basePrice === 80 ? 55 : 55
      return `${pricePerHour} €`
    }
    return "0 €"
  }

  const getTotalPrice = () => {
    let total = 0
    selectedServices.forEach((serviceName) => {
      const service = services.find((s) => s.name === serviceName)
      if (service && service.hasSlider && sliderValues[serviceName] > 0) {
        total += 55
      }
    })
    return total
  }

  const getFormattedDateTime = () => {
    if (selectedDate && selectedTime && selectedEndTime) {
      return `01.02.2024 - ${selectedTime} - ${selectedEndTime}`
    }
    return "Select"
  }

  const getFormattedLocation = () => {
    if (selectedLocations.length > 0) {
      return selectedLocations.join(", ")
    }
    return "Select"
  }

  const handleRequestBooking = () => {
    const totalPrice = getTotalPrice()
    const serviceFee = 8
    const finalTotal = totalPrice + serviceFee

    const newBooking = {
      name: "Linda L.",
      age: 23,
      status: "Booking pending",
      needsPayment: true,
      services: selectedServices,
      dateTime: getFormattedDateTime(),
      location: getFormattedLocation(),
      totalPrice: finalTotal,
    }

    addBooking(newBooking)
    setShowBookingConfirmation(true)
  }

  const handleBookingConfirmationClose = () => {
    setShowBookingConfirmation(false)
    router.push("/bookings")
  }

  return (
    <div className="max-w-sm mx-auto bg-[#f2f2f2] min-h-screen relative">
      {/* Header */}
      <div className="flex items-center px-6 py-4">
        <ArrowLeft className="w-6 h-6 text-[#000000] mr-4" />
        <h1 className="text-xl font-semibold text-[#000000] flex-1 text-center mr-10">Service selection</h1>
      </div>

      {/* Content */}
      <div className="px-6 pb-32">
        {/* Provider Name */}
        <h2 className="text-2xl font-bold text-[#000000] mb-8">Linda L.</h2>

        {/* Service Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[#000000] mb-2">Select preferred services</h3>
          <p className={`text-sm mb-6 ${getTotalPrice() >= 85 ? "text-[#219653]" : "text-[#ff3b30]"}`}>
            {getTotalPrice() >= 85
              ? "You have reached the minimum of 85€ excl. service fee"
              : "You have not reached the minimum of 85€ excl. service fee"}
          </p>

          <div className="space-y-6">
            {services.map((service) => (
              <div key={service.name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleService(service.name)}
                      className="w-5 h-5 border-2 border-[#767676] rounded-full mr-3 flex items-center justify-center"
                    >
                      {selectedServices.includes(service.name) && (
                        <div className="w-3 h-3 bg-[#000000] rounded-full"></div>
                      )}
                    </button>
                    <span className="text-[#767676] text-base">{service.name}</span>
                  </div>
                  <span className="text-[#000000] font-medium">{getServicePrice(service)}</span>
                </div>

                {service.hasSlider && selectedServices.includes(service.name) && (
                  <div className="ml-8 mt-2">
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="120"
                        value={sliderValues[service.name]}
                        onChange={(e) => updateSliderValue(service.name, Number.parseInt(e.target.value))}
                        className="w-full h-2 bg-[#d8d8d8] rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div
                        className="absolute left-0 w-6 h-6 bg-[#000000] rounded-full -top-2 cursor-pointer"
                        style={{ left: `${(sliderValues[service.name] / 120) * (100 - 6)}%` }}
                      ></div>
                    </div>
                    <p className="text-center text-[#767676] text-sm mt-1">{sliderValues[service.name]} minutes</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Date & Time */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#000000] mb-3">Date & time</h3>
          <div className="relative">
            <button
              onClick={() => setShowDateTimeModal(true)}
              className="w-full bg-[#ffffff] border border-[#d8d8d8] rounded-lg px-4 py-3 flex items-center justify-between"
            >
              <span className="text-[#000000]">{getFormattedDateTime()}</span>
              <Clock className="w-5 h-5 text-[#767676]" />
            </button>
          </div>
        </div>

        {/* Service Location */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[#000000] mb-3">Service location</h3>
          <div className="relative">
            <button
              onClick={() => setShowLocationModal(true)}
              className="w-full bg-[#ffffff] border border-[#d8d8d8] rounded-lg px-4 py-3 text-left"
            >
              <span className="text-[#000000]">{getFormattedLocation()}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Date & Time Selection Modal */}
      {showDateTimeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#ffffff] rounded-3xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#d8d8d8]">
              <div className="flex items-center">
                <Calendar className="w-6 h-6 text-[#000000] mr-3" />
                <h2 className="text-2xl font-bold text-[#000000]">Date & time</h2>
              </div>
              <button onClick={() => setShowDateTimeModal(false)}>
                <X className="w-6 h-6 text-[#000000]" />
              </button>
            </div>

            {/* Calendar */}
            <div className="p-6">
              {/* Month/Year Navigation */}
              <div className="flex items-center justify-between mb-6">
                <ChevronLeft className="w-6 h-6 text-[#767676]" />
                <div className="flex items-center">
                  <span className="text-xl font-medium text-[#000000] mr-2">{currentMonth}</span>
                  <ChevronDown className="w-5 h-5 text-[#767676] mr-4" />
                  <span className="text-xl font-medium text-[#000000]">{currentYear}</span>
                </div>
                <ChevronRight className="w-6 h-6 text-[#767676]" />
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-6">
                {/* Day Headers */}
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day} className="text-center text-[#767676] text-sm font-medium py-2">
                    {day}
                  </div>
                ))}

                {/* Calendar Dates */}
                {calendarDates.map((dateInfo) => (
                  <div key={dateInfo.date} className="relative">
                    <button
                      onClick={() => setSelectedDate(dateInfo.date)}
                      className={`w-full aspect-square flex items-center justify-center text-lg font-medium rounded-lg ${
                        dateInfo.selected ? "bg-[#2f80ed] text-[#ffffff]" : "text-[#000000] hover:bg-[#f2f2f2]"
                      }`}
                    >
                      {dateInfo.date}
                    </button>
                    {/* Availability Indicator */}
                    <div
                      className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                        dateInfo.available ? "bg-[#219653]" : "bg-[#ff3b30]"
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#000000] mb-4">Start time</h3>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {timeSlots.slice(0, 4).map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 px-4 rounded-lg border-2 text-lg font-medium ${
                        selectedTime === time
                          ? "border-[#2f80ed] bg-[#2f80ed] text-[#ffffff]"
                          : "border-[#d8d8d8] text-[#000000]"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {timeSlots.slice(4).map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 px-4 rounded-lg border-2 text-lg font-medium ${
                        selectedTime === time
                          ? "border-[#2f80ed] bg-[#2f80ed] text-[#ffffff]"
                          : "border-[#d8d8d8] text-[#000000]"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* End Time Slots */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#000000] mb-4">End time</h3>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {timeSlots.slice(0, 4).map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedEndTime(time)}
                      className={`py-3 px-4 rounded-lg border-2 text-lg font-medium ${
                        selectedEndTime === time
                          ? "border-[#2f80ed] bg-[#2f80ed] text-[#ffffff]"
                          : "border-[#d8d8d8] text-[#000000]"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {timeSlots.slice(4).map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedEndTime(time)}
                      className={`py-3 px-4 rounded-lg border-2 text-lg font-medium ${
                        selectedEndTime === time
                          ? "border-[#2f80ed] bg-[#2f80ed] text-[#ffffff]"
                          : "border-[#d8d8d8] text-[#000000]"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-0">
              <button
                onClick={() => setShowDateTimeModal(false)}
                className="w-full bg-[#767676] text-[#ffffff] py-4 rounded-lg font-medium text-lg"
              >
                Select
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hosting Location Selection Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#ffffff] rounded-3xl w-full max-w-sm">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#d8d8d8]">
              <div className="flex items-center">
                <Calendar className="w-6 h-6 text-[#000000] mr-3" />
                <h2 className="text-2xl font-bold text-[#000000]">Hosting location</h2>
              </div>
              <button onClick={() => setShowLocationModal(false)}>
                <X className="w-6 h-6 text-[#000000]" />
              </button>
            </div>

            {/* Location Options */}
            <div className="p-6">
              <p className="text-[#767676] text-base mb-6">Select one or a combination.</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {locationOptions.map((location) => (
                  <button
                    key={location}
                    onClick={() => toggleLocation(location)}
                    className={`py-4 px-4 rounded-lg text-base font-medium ${
                      selectedLocations.includes(location)
                        ? "bg-[#2f80ed] text-[#ffffff]"
                        : "bg-[#f2f2f2] text-[#767676]"
                    }`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-0">
              <button
                onClick={() => setShowLocationModal(false)}
                className="w-full bg-[#767676] text-[#ffffff] py-4 rounded-lg font-medium text-lg"
              >
                Select
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-16 left-0 right-0 px-6">
        <button
          onClick={handleRequestBooking}
          className="w-full bg-[#767676] text-[#ffffff] py-4 rounded-lg font-medium text-lg"
        >
          Request booking
        </button>
      </div>

      {showBookingConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#ffffff] rounded-3xl w-full max-w-sm">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#d8d8d8]">
              <div className="flex items-center">
                <Calendar className="w-6 h-6 text-[#000000] mr-3" />
                <h2 className="text-2xl font-bold text-[#000000]">Booking confirmed</h2>
              </div>
              <button onClick={handleBookingConfirmationClose}>
                <X className="w-6 h-6 text-[#000000]" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-[#767676] text-base mb-4">Get in touch with the Hagu to discuss further details.</p>
              <p className="text-[#767676] text-base mb-8">You can review your booking under Bookings.</p>
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-0">
              <button
                onClick={handleBookingConfirmationClose}
                className="w-full bg-[#767676] text-[#ffffff] py-4 rounded-lg font-medium text-lg"
              >
                Thanks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#ffffff] border-t border-[#d8d8d8]">
        <div className="flex items-center justify-around py-2">
          <Link href="/" className="flex flex-col items-center py-2">
            <Search className="w-6 h-6 text-[#767676] mb-1" />
            <span className="text-xs text-[#767676]">Explore</span>
          </Link>
          <Link href="/favorites" className="flex flex-col items-center py-2">
            <Heart className="w-6 h-6 text-[#767676] mb-1" />
            <span className="text-xs text-[#767676]">Favorites</span>
          </Link>
          <div className="flex flex-col items-center py-2 relative">
            <MessageCircle className="w-6 h-6 text-[#767676] mb-1" />
            <span className="text-xs text-[#767676]">Chat</span>
            <div className="absolute -top-1 right-2 w-4 h-4 bg-[#ff3b30] rounded-full flex items-center justify-center">
              <span className="text-[#ffffff] text-xs">1</span>
            </div>
          </div>
          <Link href="/bookings" className="flex flex-col items-center py-2 relative">
            <Calendar className="w-6 h-6 text-[#767676] mb-1" />
            <span className="text-xs text-[#767676]">Bookings</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center py-2 relative">
            <User className="w-6 h-6 text-[#767676] mb-1" />
            <span className="text-xs text-[#767676]">Profile</span>
            <div className="absolute -top-1 right-2 w-4 h-4 bg-[#ff3b30] rounded-full flex items-center justify-center">
              <span className="text-[#ffffff] text-xs">1</span>
            </div>
          </Link>
        </div>
        <div className="w-32 h-1 bg-[#000000] rounded-full mx-auto mb-1"></div>
      </div>
    </div>
  )
}
;<style jsx>{`
  .slider::-webkit-slider-thumb {
    appearance: none;
    width: 24px;
    height: 24px;
    background: #000000;
    border-radius: 50%;
    cursor: pointer;
  }
  
  .slider::-moz-range-thumb {
    width: 24px;
    height: 24px;
    background: #000000;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
`}</style>
