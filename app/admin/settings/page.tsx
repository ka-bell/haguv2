"use client"

import { useState, useEffect } from "react"
import {
  Settings,
  DollarSign,
  Calendar,
  Bell,
  Save,
  Loader2,
  Tag,
  Grid3X3,
} from "lucide-react"
import AdminLayout from "@/components/cms/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import {
  getPlatformSettingsMock,
  updateGeneralSettingsMock,
  updateServiceRatesMock,
  updateBookingSettingsMock,
  fetchCategoriesMock,
  fetchTagsMock,
  createCategoryMock,
  updateCategoryMock,
  deleteCategoryMock,
  createTagMock,
  updateTagMock,
  deleteTagMock,
} from "@/lib/cms/api"
import type { PlatformSettings, Category, Tag as TagType } from "@/lib/cms/types"

export default function SettingsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<"general" | "rates" | "booking" | "categories" | "tags">("general")
  const [settings, setSettings] = useState<PlatformSettings | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<TagType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  // Form states
  const [generalForm, setGeneralForm] = useState({
    platform_name: "",
    support_email: "",
    support_phone: "",
    default_language: "nl",
    default_currency: "EUR",
  })
  
  const [ratesForm, setRatesForm] = useState({
    platform_fee_percent: 10,
    minimum_booking_amount_cents: 1000,
    hagu_payout_delay_days: 7,
    stripe_connect_enabled: true,
  })
  
  const [bookingForm, setBookingForm] = useState({
    min_advance_booking_hours: 24,
    max_advance_booking_days: 90,
    cancellation_policy_hours: 24,
    reschedule_policy_hours: 12,
    auto_confirm_bookings: false,
    require_verified_hagu: true,
  })

  // Load data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [settingsData, categoriesData, tagsData] = await Promise.all([
        getPlatformSettingsMock(),
        fetchCategoriesMock(),
        fetchTagsMock(),
      ])
      
      setSettings(settingsData)
      setCategories(categoriesData)
      setTags(tagsData)
      
      // Populate forms
      setGeneralForm({
        platform_name: settingsData.general.platform_name,
        support_email: settingsData.general.support_email,
        support_phone: settingsData.general.support_phone || "",
        default_language: settingsData.general.default_language,
        default_currency: settingsData.general.default_currency,
      })
      
      setRatesForm({
        platform_fee_percent: settingsData.service_rates.platform_fee_percent,
        minimum_booking_amount_cents: settingsData.service_rates.minimum_booking_amount_cents,
        hagu_payout_delay_days: settingsData.service_rates.hagu_payout_delay_days,
        stripe_connect_enabled: settingsData.service_rates.stripe_connect_enabled,
      })
      
      setBookingForm({
        min_advance_booking_hours: settingsData.booking_settings.min_advance_booking_hours,
        max_advance_booking_days: settingsData.booking_settings.max_advance_booking_days,
        cancellation_policy_hours: settingsData.booking_settings.cancellation_policy_hours,
        reschedule_policy_hours: settingsData.booking_settings.reschedule_policy_hours,
        auto_confirm_bookings: settingsData.booking_settings.auto_confirm_bookings,
        require_verified_hagu: settingsData.booking_settings.require_verified_hagu,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Save handlers
  const saveGeneral = async () => {
    setIsSaving(true)
    try {
      await updateGeneralSettingsMock(generalForm)
      toast({ title: "Success", description: "General settings saved" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to save", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const saveRates = async () => {
    setIsSaving(true)
    try {
      await updateServiceRatesMock(ratesForm)
      toast({ title: "Success", description: "Service rates saved" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to save", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const saveBooking = async () => {
    setIsSaving(true)
    try {
      await updateBookingSettingsMock(bookingForm)
      toast({ title: "Success", description: "Booking settings saved" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to save", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  // Category handlers
  const [newCategory, setNewCategory] = useState({ name: "", slug: "", description: "" })
  const addCategory = async () => {
    if (!newCategory.name || !newCategory.slug) return
    try {
      await createCategoryMock({
        name: newCategory.name,
        slug: newCategory.slug,
        description: newCategory.description || null,
        icon: null,
        is_active: true,
        sort_order: categories.length + 1,
      })
      setNewCategory({ name: "", slug: "", description: "" })
      const updated = await fetchCategoriesMock()
      setCategories(updated)
      toast({ title: "Success", description: "Category added" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to add category", variant: "destructive" })
    }
  }

  const toggleCategory = async (category: Category) => {
    try {
      await updateCategoryMock(category.id, { is_active: !category.is_active })
      const updated = await fetchCategoriesMock()
      setCategories(updated)
    } catch (error) {
      toast({ title: "Error", description: "Failed to update", variant: "destructive" })
    }
  }

  const deleteCategory = async (id: number) => {
    try {
      await deleteCategoryMock(id)
      const updated = await fetchCategoriesMock()
      setCategories(updated)
      toast({ title: "Success", description: "Category deleted" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" })
    }
  }

  // Tag handlers
  const [newTag, setNewTag] = useState({ name: "", slug: "", color: "#6366f1" })
  const addTag = async () => {
    if (!newTag.name || !newTag.slug) return
    try {
      await createTagMock({
        name: newTag.name,
        slug: newTag.slug,
        description: null,
        color: newTag.color,
        is_active: true,
      })
      setNewTag({ name: "", slug: "", color: "#6366f1" })
      const updated = await fetchTagsMock()
      setTags(updated)
      toast({ title: "Success", description: "Tag added" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to add tag", variant: "destructive" })
    }
  }

  const deleteTag = async (id: number) => {
    try {
      await deleteTagMock(id)
      const updated = await fetchTagsMock()
      setTags(updated)
      toast({ title: "Success", description: "Tag deleted" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" })
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-gray-600">Manage platform configuration and settings</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
          <Button
            variant={activeTab === "general" ? "primary" : "outline"}
            onClick={() => setActiveTab("general")}
            className={activeTab === "general" ? "bg-[#2D1012]" : ""}
          >
            <Settings className="w-4 h-4 mr-2" />
            General
          </Button>
          <Button
            variant={activeTab === "rates" ? "primary" : "outline"}
            onClick={() => setActiveTab("rates")}
            className={activeTab === "rates" ? "bg-[#2D1012]" : ""}
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Service Rates
          </Button>
          <Button
            variant={activeTab === "booking" ? "primary" : "outline"}
            onClick={() => setActiveTab("booking")}
            className={activeTab === "booking" ? "bg-[#2D1012]" : ""}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Booking
          </Button>
          <Button
            variant={activeTab === "categories" ? "primary" : "outline"}
            onClick={() => setActiveTab("categories")}
            className={activeTab === "categories" ? "bg-[#2D1012]" : ""}
          >
            <Grid3X3 className="w-4 h-4 mr-2" />
            Categories
          </Button>
          <Button
            variant={activeTab === "tags" ? "primary" : "outline"}
            onClick={() => setActiveTab("tags")}
            className={activeTab === "tags" ? "bg-[#2D1012]" : ""}
          >
            <Tag className="w-4 h-4 mr-2" />
            Tags
          </Button>
        </div>

        {/* General Settings */}
        {activeTab === "general" && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              General Settings
            </h2>
            <div className="grid gap-4 max-w-2xl">
              <div>
                <label className="text-sm font-medium">Platform Name</label>
                <Input
                  value={generalForm.platform_name}
                  onChange={(e) => setGeneralForm({ ...generalForm, platform_name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Support Email</label>
                <Input
                  type="email"
                  value={generalForm.support_email}
                  onChange={(e) => setGeneralForm({ ...generalForm, support_email: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Support Phone</label>
                <Input
                  value={generalForm.support_phone}
                  onChange={(e) => setGeneralForm({ ...generalForm, support_phone: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Default Language</label>
                  <select
                    value={generalForm.default_language}
                    onChange={(e) => setGeneralForm({ ...generalForm, default_language: e.target.value })}
                    className="mt-1 w-full h-10 px-3 border rounded-md"
                  >
                    <option value="nl">Dutch</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Default Currency</label>
                  <select
                    value={generalForm.default_currency}
                    onChange={(e) => setGeneralForm({ ...generalForm, default_currency: e.target.value })}
                    className="mt-1 w-full h-10 px-3 border rounded-md"
                  >
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>
              <Button
                onClick={saveGeneral}
                disabled={isSaving}
                className="w-fit mt-4 bg-[#2D1012]"
              >
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Changes
              </Button>
            </div>
          </Card>
        )}

        {/* Service Rates */}
        {activeTab === "rates" && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Service Rates
            </h2>
            <div className="grid gap-4 max-w-2xl">
              <div>
                <label className="text-sm font-medium">Platform Fee (%)</label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={ratesForm.platform_fee_percent}
                  onChange={(e) => setRatesForm({ ...ratesForm, platform_fee_percent: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Minimum Booking Amount (cents)</label>
                <Input
                  type="number"
                  min={0}
                  value={ratesForm.minimum_booking_amount_cents}
                  onChange={(e) => setRatesForm({ ...ratesForm, minimum_booking_amount_cents: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">HAGU Payout Delay (days)</label>
                <Input
                  type="number"
                  min={0}
                  value={ratesForm.hagu_payout_delay_days}
                  onChange={(e) => setRatesForm({ ...ratesForm, hagu_payout_delay_days: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="stripe_connect"
                  checked={ratesForm.stripe_connect_enabled}
                  onChange={(e) => setRatesForm({ ...ratesForm, stripe_connect_enabled: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="stripe_connect" className="text-sm font-medium">
                  Stripe Connect Enabled
                </label>
              </div>
              <Button
                onClick={saveRates}
                disabled={isSaving}
                className="w-fit mt-4 bg-[#2D1012]"
              >
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Changes
              </Button>
            </div>
          </Card>
        )}

        {/* Booking Settings */}
        {activeTab === "booking" && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Booking Settings
            </h2>
            <div className="grid gap-4 max-w-2xl">
              <div>
                <label className="text-sm font-medium">Min Advance Booking (hours)</label>
                <Input
                  type="number"
                  min={0}
                  value={bookingForm.min_advance_booking_hours}
                  onChange={(e) => setBookingForm({ ...bookingForm, min_advance_booking_hours: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Max Advance Booking (days)</label>
                <Input
                  type="number"
                  min={0}
                  value={bookingForm.max_advance_booking_days}
                  onChange={(e) => setBookingForm({ ...bookingForm, max_advance_booking_days: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Cancellation Policy (hours)</label>
                <Input
                  type="number"
                  min={0}
                  value={bookingForm.cancellation_policy_hours}
                  onChange={(e) => setBookingForm({ ...bookingForm, cancellation_policy_hours: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Reschedule Policy (hours)</label>
                <Input
                  type="number"
                  min={0}
                  value={bookingForm.reschedule_policy_hours}
                  onChange={(e) => setBookingForm({ ...bookingForm, reschedule_policy_hours: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="auto_confirm"
                    checked={bookingForm.auto_confirm_bookings}
                    onChange={(e) => setBookingForm({ ...bookingForm, auto_confirm_bookings: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="auto_confirm" className="text-sm font-medium">
                    Auto-confirm Bookings
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="require_verified"
                    checked={bookingForm.require_verified_hagu}
                    onChange={(e) => setBookingForm({ ...bookingForm, require_verified_hagu: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="require_verified" className="text-sm font-medium">
                    Require Verified HAGU
                  </label>
                </div>
              </div>
              <Button
                onClick={saveBooking}
                disabled={isSaving}
                className="w-fit mt-4 bg-[#2D1012]"
              >
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Changes
              </Button>
            </div>
          </Card>
        )}

        {/* Categories */}
        {activeTab === "categories" && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Grid3X3 className="w-5 h-5" />
              Categories
            </h2>
            
            {/* Add Category */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Input
                placeholder="Name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
              <Input
                placeholder="Slug"
                value={newCategory.slug}
                onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
              />
              <Button onClick={addCategory} className="bg-[#2D1012]">Add Category</Button>
            </div>

            {/* Categories List */}
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-sm text-gray-500">({category.slug})</span>
                    {!category.is_active && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-gray-200 text-gray-600">Inactive</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleCategory(category)}
                    >
                      {category.is_active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                      onClick={() => deleteCategory(category.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Tags */}
        {activeTab === "tags" && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Tags
            </h2>
            
            {/* Add Tag */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Input
                placeholder="Name"
                value={newTag.name}
                onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
              />
              <Input
                placeholder="Slug"
                value={newTag.slug}
                onChange={(e) => setNewTag({ ...newTag, slug: e.target.value })}
              />
              <input
                type="color"
                value={newTag.color}
                onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                className="h-10 rounded border"
              />
              <Button onClick={addTag} className="bg-[#2D1012]">Add Tag</Button>
            </div>

            {/* Tags List */}
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
                  style={{ backgroundColor: tag.color ? tag.color + "20" : "#e5e7eb", color: tag.color || "#374151", border: `1px solid ${tag.color || "#d1d5db"}` }}
                >
                  <span>{tag.name}</span>
                  <button
                    onClick={() => deleteTag(tag.id)}
                    className="hover:opacity-70"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
