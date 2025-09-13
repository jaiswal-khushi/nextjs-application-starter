'use client'

import React, { useEffect, useState } from 'react'
import { Buyer, Status, City, PropertyType } from '@/types/buyer'

const PAGE_SIZE = 10

export default function HomePage() {
  const [buyers, setBuyers] = useState<Buyer[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [cityFilter, setCityFilter] = useState<string | undefined>(undefined)
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  async function fetchBuyers() {
    setLoading(true)
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', PAGE_SIZE.toString())
    if (search) params.append('search', search)
    if (statusFilter) params.append('status', statusFilter)
    if (cityFilter) params.append('city', cityFilter)
    if (propertyTypeFilter) params.append('propertyType', propertyTypeFilter)

    const token = localStorage.getItem('auth-token')
    const res = await fetch(`/api/buyers?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (res.ok) {
      const data = await res.json()
      setBuyers(data.buyers)
      setTotalPages(data.pagination.pages)
    } else {
      console.error('Failed to fetch buyers')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchBuyers()
  }, [page, search, statusFilter, cityFilter, propertyTypeFilter])

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value)
    setPage(1)
  }

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setStatusFilter(e.target.value || undefined)
    setPage(1)
  }

  function handleCityChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setCityFilter(e.target.value || undefined)
    setPage(1)
  }

  function handlePropertyTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setPropertyTypeFilter(e.target.value || undefined)
    setPage(1)
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Buyer Lead Management</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or phone"
          value={search}
          onChange={handleSearchChange}
          className="border border-gray-300 rounded px-3 py-2 flex-grow min-w-[200px]"
        />

        <select
          value={statusFilter || ''}
          onChange={handleStatusChange}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">All Statuses</option>
          {Object.values(Status).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={cityFilter || ''}
          onChange={handleCityChange}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">All Cities</option>
          {Object.values(City).map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <select
          value={propertyTypeFilter || ''}
          onChange={handlePropertyTypeChange}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">All Property Types</option>
          {Object.values(PropertyType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-2 py-1 text-left">Name</th>
              <th className="border border-gray-300 px-2 py-1 text-left">Email</th>
              <th className="border border-gray-300 px-2 py-1 text-left">Phone</th>
              <th className="border border-gray-300 px-2 py-1 text-left">City</th>
              <th className="border border-gray-300 px-2 py-1 text-left">Property Type</th>
              <th className="border border-gray-300 px-2 py-1 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {buyers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No buyers found.
                </td>
              </tr>
            ) : (
              buyers.map((buyer) => (
                <tr key={buyer.id}>
                  <td className="border border-gray-300 px-2 py-1">{buyer.fullName}</td>
                  <td className="border border-gray-300 px-2 py-1">{buyer.email || '-'}</td>
                  <td className="border border-gray-300 px-2 py-1">{buyer.phone}</td>
                  <td className="border border-gray-300 px-2 py-1">{buyer.city}</td>
                  <td className="border border-gray-300 px-2 py-1">{buyer.propertyType}</td>
                  <td className="border border-gray-300 px-2 py-1">{buyer.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="self-center">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}
