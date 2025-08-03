'use client'
import EditProvider from '@/views/providers/EditProvider'
import ProviderFormPage from '@/views/providers/EditProvider'
import { EditorProvider } from '@tiptap/react'
import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ex } from 'node_modules/@fullcalendar/core/internal-common'

const Page = () => {
  const searchParams = useSearchParams()
  const serviceId = searchParams('serviceId')
  const providerId = searchParams('providerId') // Will be null for "add" mode
  return <EditProvider serviceId={serviceId} providerId={providerId} />
}

export default Page
