// src/lib/test-api.ts

import { Form, FormField } from '@/types'

const API_BASE = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

interface TestResult {
  endpoint: string
  method: string
  status: 'PASS' | 'FAIL'
  statusCode?: number
  error?: string
  data?: any
  duration?: number
}

class APITester {
  private results: TestResult[] = []

  private async makeRequest(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
  ): Promise<TestResult> {
    const start = Date.now()
    
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined
      })

      const duration = Date.now() - start
      const data = await response.json()

      const result: TestResult = {
        endpoint,
        method,
        status: response.ok ? 'PASS' : 'FAIL',
        statusCode: response.status,
        data,
        duration
      }

      if (!response.ok) {
        result.error = data.error || `HTTP ${response.status}`
      }

      this.results.push(result)
      return result

    } catch (error) {
      const duration = Date.now() - start
      const result: TestResult = {
        endpoint,
        method,
        status: 'FAIL',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration
      }

      this.results.push(result)
      return result
    }
  }

  // Test sample form data
  private getSampleForm() {
    return {
      title: 'Test Form',
      description: 'A test form for API testing',
      prompt: 'Create a simple contact form',
      fields: [
        {
          id: 'name',
          type: 'shortText',
          label: 'Full Name',
          required: true,
          placeholder: 'Enter your name'
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email Address',
          required: true,
          placeholder: 'name@example.com'
        },
        {
          id: 'rating',
          type: 'numberRating',
          label: 'Rate our service',
          required: false,
          minRating: 1,
          maxRating: 5
        },
        {
          id: 'feedback',
          type: 'multipleChoice',
          label: 'How did you hear about us?',
          required: false,
          options: ['Social Media', 'Friend', 'Search Engine', 'Other']
        }
      ] as FormField[],
      theme: {
        primaryColor: '#3B82F6',
        fontFamily: 'Inter, sans-serif'
      },
      customization: {
        colors: {
          primary: '#3B82F6',
          background: '#FFFFFF'
        }
      },
      layout: {
        type: 'singleColumn',
        options: {
          maxWidth: 600
        }
      },
      settings: {
        allowMultipleSubmissions: true,
        collectIPAddress: true,
        submitButtonText: 'Submit Test'
      }
    }
  }

  // Test 1: Health Check
  async testHealthCheck() {
    console.log('🏥 Testing Health Check...')
    const result = await this.makeRequest('/api/health')
    
    if (result.status === 'PASS') {
      console.log('✅ Health check passed')
      console.log('  Database:', result.data?.database)
    } else {
      console.log('❌ Health check failed:', result.error)
    }
    
    return result
  }

  // Test 2: Create Form
  async testCreateForm() {
    console.log('📝 Testing Form Creation...')
    const sampleForm = this.getSampleForm()
    const result = await this.makeRequest('/api/forms', 'POST', sampleForm)
    
    if (result.status === 'PASS') {
      console.log('✅ Form created successfully')
      console.log('  Form ID:', result.data?.id)
      console.log('  Title:', result.data?.title)
      return result.data // Return the created form for other tests
    } else {
      console.log('❌ Form creation failed:', result.error)
      return null
    }
  }

  // Test 3: Get All Forms
  async testGetForms() {
    console.log('📋 Testing Get All Forms...')
    const result = await this.makeRequest('/api/forms')
    
    if (result.status === 'PASS') {
      console.log('✅ Forms retrieved successfully')
      console.log('  Count:', result.data?.length || 0)
    } else {
      console.log('❌ Get forms failed:', result.error)
    }
    
    return result
  }

  // Test 4: Get Single Form
  async testGetForm(formId: string) {
    console.log('📄 Testing Get Single Form...')
    const result = await this.makeRequest(`/api/forms/${formId}`)
    
    if (result.status === 'PASS') {
      console.log('✅ Form retrieved successfully')
      console.log('  Title:', result.data?.title)
      console.log('  Fields count:', result.data?.fields?.length || 0)
    } else {
      console.log('❌ Get form failed:', result.error)
    }
    
    return result
  }

  // Test 5: Update Form
  async testUpdateForm(formId: string) {
    console.log('✏️ Testing Form Update...')
    const updateData = {
      title: 'Updated Test Form',
      description: 'This form has been updated'
    }
    
    const result = await this.makeRequest(`/api/forms/${formId}`, 'PUT', updateData)
    
    if (result.status === 'PASS') {
      console.log('✅ Form updated successfully')
      console.log('  New title:', result.data?.title)
    } else {
      console.log('❌ Form update failed:', result.error)
    }
    
    return result
  }

  // Test 6: Submit Form Response
  async testSubmitForm(formId: string) {
    console.log('📤 Testing Form Submission...')
    const submissionData = {
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        rating: 4,
        feedback: 'Social Media'
      }
    }
    
    const result = await this.makeRequest(`/api/forms/${formId}/submit`, 'POST', submissionData)
    
    if (result.status === 'PASS') {
      console.log('✅ Form submitted successfully')
      console.log('  Response ID:', result.data?.responseId)
    } else {
      console.log('❌ Form submission failed:', result.error)
    }
    
    return result
  }

  // Test 7: Get Form Responses
  async testGetResponses(formId: string) {
    console.log('📊 Testing Get Responses...')
    const result = await this.makeRequest(`/api/forms/${formId}/responses`)
    
    if (result.status === 'PASS') {
      console.log('✅ Responses retrieved successfully')
      console.log('  Count:', result.data?.length || 0)
    } else {
      console.log('❌ Get responses failed:', result.error)
    }
    
    return result
  }

  // Test 8: Analytics
  async testAnalytics(formId: string) {
    console.log('📈 Testing Analytics...')
    const result = await this.makeRequest(`/api/forms/${formId}/analytics`)
    
    if (result.status === 'PASS') {
      console.log('✅ Analytics retrieved successfully')
      console.log('  Total responses:', result.data?.totalResponses)
      console.log('  Completion rate:', result.data?.completionRate + '%')
    } else {
      console.log('❌ Analytics failed:', result.error)
    }
    
    return result
  }

  // Test 9: Export
  async testExport(formId: string) {
    console.log('📥 Testing Export...')
    const result = await this.makeRequest(`/api/forms/${formId}/export?format=json`)
    
    if (result.status === 'PASS') {
      console.log('✅ Export successful')
    } else {
      console.log('❌ Export failed:', result.error)
    }
    
    return result
  }

  // Test 10: QR Code Generation
  async testQRGeneration(formId: string) {
    console.log('🔲 Testing QR Code Generation...')
    const qrData = {
      url: `${API_BASE}/form/${formId}`,
      size: 200
    }
    
    const result = await this.makeRequest('/api/qr/generate', 'POST', qrData)
    
    if (result.status === 'PASS') {
      console.log('✅ QR code generated successfully')
      console.log('  Data URL length:', result.data?.qrCodeDataUrl?.length || 0)
    } else {
      console.log('❌ QR generation failed:', result.error)
    }
    
    return result
  }

  // Test 11: Delete Form
  async testDeleteForm(formId: string) {
    console.log('🗑️ Testing Form Deletion...')
    const result = await this.makeRequest(`/api/forms/${formId}`, 'DELETE')
    
    if (result.status === 'PASS') {
      console.log('✅ Form deleted successfully')
      console.log('  Deleted responses:', result.data?.deletedResponsesCount)
    } else {
      console.log('❌ Form deletion failed:', result.error)
    }
    
    return result
  }

  // Run all tests
  async runAllTests() {
    console.log('🚀 Starting API Tests...\n')
    
    const startTime = Date.now()
    let createdForm: any = null
    
    try {
      // Test 1: Health Check
      await this.testHealthCheck()
      console.log('')

      // Test 2: Create Form
      createdForm = await this.testCreateForm()
      console.log('')
      
      if (!createdForm) {
        console.log('❌ Cannot continue tests without a form')
        return this.printSummary()
      }

      // Test 3-11: Use the created form
      await this.testGetForms()
      console.log('')
      
      await this.testGetForm(createdForm.id)
      console.log('')
      
      await this.testUpdateForm(createdForm.id)
      console.log('')
      
      await this.testSubmitForm(createdForm.id)
      console.log('')
      
      await this.testGetResponses(createdForm.id)
      console.log('')
      
      await this.testAnalytics(createdForm.id)
      console.log('')
      
      await this.testExport(createdForm.id)
      console.log('')
      
      await this.testQRGeneration(createdForm.id)
      console.log('')
      
      // Test deletion last
      await this.testDeleteForm(createdForm.id)
      console.log('')

    } catch (error) {
      console.error('❌ Test suite failed:', error)
    }

    const totalTime = Date.now() - startTime
    console.log(`⏱️ Total test time: ${totalTime}ms\n`)
    
    this.printSummary()
  }

  // Print test summary
  private printSummary() {
    const passed = this.results.filter(r => r.status === 'PASS').length
    const failed = this.results.filter(r => r.status === 'FAIL').length
    
    console.log('📊 Test Summary:')
    console.log(`✅ Passed: ${passed}`)
    console.log(`❌ Failed: ${failed}`)
    console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`)
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:')
      this.results
        .filter(r => r.status === 'FAIL')
        .forEach(r => {
          console.log(`  ${r.method} ${r.endpoint}: ${r.error}`)
        })
    }
    
    return this.results
  }
}

export default APITester