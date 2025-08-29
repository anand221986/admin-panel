import React, { useState } from 'react';
import { X, ChevronDown, Trash2 } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  logo: string;
  fields?: Array<{
    label: string;
    placeholder: string;
    required: boolean;
  }>;
  options?: Array<{
    label: string;
    checked: boolean;
  }>;
}

const IntegrationPage: React.FC = () => {
  const [selectedIntegration, setSelectedIntegration] = useState<string>('Twilio');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<Record<string, string>>({
    accountSid: '',
    authToken: '',
    phoneNumber: ''
  });
  const [autoCallLogging, setAutoCallLogging] = useState<boolean>(false);
  const [slackNotifications, setSlackNotifications] = useState<boolean>(false);
  const [isZapierModalOpen, setIsZapierModalOpen] = useState<boolean>(false);
  const [isAddIntegrationModalOpen, setIsAddIntegrationModalOpen] = useState<boolean>(false);
  const [isEntityDropdownOpen, setIsEntityDropdownOpen] = useState<boolean>(false);
  const [isMethodDropdownOpen, setIsMethodDropdownOpen] = useState<boolean>(false);
  const [zapierFormData, setZapierFormData] = useState({
    name: '',
    formType: '',
    sendErrorsTo: '',
    fieldsToSave: ''
  });
  const [addIntegrationFormData, setAddIntegrationFormData] = useState({
    integrationType: 'Webhook integration',
    entity: '',
    webhookName: '',
    webhook: '',
    method: ''
  });

  const integrations: Integration[] = [
    {
      id: 'twilio',
      name: 'Twilio',
      logo: '🔴',
      fields: [
        { label: 'ACCOUNT SID', placeholder: 'Enter Twilio Account SID', required: true },
        { label: 'AUTH TOKEN', placeholder: 'Enter Twilio Auth Token', required: true },
        { label: 'PHONE NUMBER(INCLUDING COUNTRY CODE)', placeholder: 'Enter Twilio Phone Number', required: true }
      ],
      options: [
        { label: 'Enable auto call logging', checked: false }
      ]
    },
    {
      id: 'ringcentral',
      name: 'Ringcentral',
      logo: '🟠',
      options: [
        { label: 'Enable auto call logging', checked: false }
      ]
    },
    {
      id: 'aircall',
      name: 'Aircall',
      logo: '🟢',
      options: [
        { label: 'Enable auto call logging', checked: false }
      ]
    }
  ];

  const availableIntegrations = [
    { name: 'Slack', logo: '💬', hasConfig: true },
    { name: 'LinkedIn Paid Job Posting', logo: '💼', hasConfig: true },
    { name: 'DocuSign', logo: '📄', hasConfig: true },
    { name: 'Microsoft Teams', logo: '👥', hasConfig: true },
    { name: 'Zapier', logo: '⚡', hasConfig: false }
  ];

  const handleInputChange = (field: string, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (): void => {
    console.log('Saving integration:', formData);
  };

  const handleZapierFormChange = (field: string, value: string): void => {
    setZapierFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleZapierSave = (): void => {
    console.log('Saving Zapier form:', zapierFormData);
    setIsZapierModalOpen(false);
    setZapierFormData({
      name: '',
      formType: '',
      sendErrorsTo: '',
      fieldsToSave: ''
    });
  };

  const handleZapierDiscard = (): void => {
    setIsZapierModalOpen(false);
    setZapierFormData({
      name: '',
      formType: '',
      sendErrorsTo: '',
      fieldsToSave: ''
    });
  };

  const handleAddIntegrationFormChange = (field: string, value: string): void => {
    setAddIntegrationFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddIntegrationSave = (): void => {
    console.log('Saving Add Integration form:', addIntegrationFormData);
    setIsAddIntegrationModalOpen(false);
    setAddIntegrationFormData({
      integrationType: 'Webhook integration',
      entity: '',
      webhookName: '',
      webhook: '',
      method: ''
    });
  };

  const handleAddIntegrationCancel = (): void => {
    setIsAddIntegrationModalOpen(false);
    setAddIntegrationFormData({
      integrationType: 'Webhook integration',
      entity: '',
      webhookName: '',
      webhook: '',
      method: ''
    });
  };

  const currentIntegration = integrations.find(int => int.name === selectedIntegration);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8">Telephony</h1>
        
        <div className="relative mb-8">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full max-w-md bg-white border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className="text-gray-700">{selectedIntegration}</span>
            <div className="flex items-center space-x-2">
              <X className="w-4 h-4 text-gray-400" />
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 w-full max-w-md mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              {integrations.map((integration) => (
                <button
                  key={integration.id}
                  onClick={() => {
                    setSelectedIntegration(integration.name);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                >
                  <span className="text-gray-700">{integration.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {currentIntegration && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                {currentIntegration.name === 'Twilio' && (
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full border-4 border-white"></div>
                  </div>
                )}
                {currentIntegration.name === 'Ringcentral' && (
                  <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded-sm"></div>
                  </div>
                )}
                {currentIntegration.name === 'Aircall' && (
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-white"></div>
                  </div>
                )}
                <h2 className="text-xl font-semibold text-gray-800">{currentIntegration.name}</h2>
              </div>
              {currentIntegration.name === 'Ringcentral' && (
                <button className="px-6 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium">
                  Connect
                </button>
              )}
              {currentIntegration.name === 'Aircall' && (
                <button className="px-6 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium">
                  Connect
                </button>
              )}
              {currentIntegration.name === 'Twilio' && (
                <button className="text-gray-400 hover:text-gray-600">
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {currentIntegration.fields && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {currentIntegration.fields.map((field, index) => (
                  <div key={index} className={field.label === 'PHONE NUMBER(INCLUDING COUNTRY CODE)' ? 'md:col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData[field.label.toLowerCase().replace(/[^a-z]/g, '')] || ''}
                      onChange={(e) => handleInputChange(field.label.toLowerCase().replace(/[^a-z]/g, ''), e.target.value)}
                    />
                  </div>
                ))}
              </div>
            )}

            {currentIntegration.fields && (
              <div className="flex justify-center mb-6">
                <button
                  onClick={handleSave}
                  className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
                >
                  Save
                </button>
              </div>
            )}

            {currentIntegration.options && (
              <div className="space-y-3">
                {currentIntegration.options.map((option, index) => (
                  <label key={index} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoCallLogging}
                      onChange={(e) => setAutoCallLogging(e.target.checked)}
                      className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">Integrations</h2>
            <button 
              onClick={() => setIsAddIntegrationModalOpen(true)}
              className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              Add Integration
            </button>
          </div>

          <div className="text-center py-12">
            <p className="text-lg text-gray-400">No Integrations found</p>
          </div>

          <div className="space-y-6 mt-8">
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 flex items-center justify-center">
                  <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded"></div>
                </div>
                <h3 className="text-lg font-medium text-gray-800">Slack</h3>
              </div>
              <p className="text-gray-600 mb-3">
                To connect a Slack workspace to Recruiterflow, click{' '}
                <a href="#" className="text-blue-500 hover:underline">here</a>
              </p>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={slackNotifications}
                  onChange={(e) => setSlackNotifications(e.target.checked)}
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Send notifications to users mentioned in notes</span>
              </label>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">in</div>
                </div>
                <h3 className="text-lg font-medium text-gray-800">LinkedIn Paid Job Posting</h3>
              </div>
              <p className="text-gray-600 mb-2">
                To get started with posting paid jobs on LinkedIn, please set up your LinkedIn Company ID in the Job board settings{' '}
                <a href="#" className="text-blue-500 hover:underline">here</a>
              </p>
              <p className="text-gray-600">
                You can find your LinkedIn Company ID by following the steps outlined{' '}
                <a href="#" className="text-blue-500 hover:underline">here</a>
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 flex items-center justify-center">
                  <div className="w-6 h-6 bg-yellow-400 rounded flex items-center justify-center">
                    <div className="w-3 h-3 bg-black rounded-sm"></div>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-800">DocuSign</h3>
              </div>
              <p className="text-gray-600">
                To connect your DocuSign account to Recruiterflow, click{' '}
                <a href="#" className="text-blue-500 hover:underline">here</a>
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 flex items-center justify-center">
                  <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">T</div>
                </div>
                <h3 className="text-lg font-medium text-gray-800">Microsoft Teams</h3>
              </div>
              <p className="text-gray-600">
                To connect a Microsoft Teams to Recruiterflow, click{' '}
                <a href="#" className="text-blue-500 hover:underline">here</a>
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">⚡</div>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">Zapier</h3>
                </div>
                <button 
                  onClick={() => setIsZapierModalOpen(true)}
                  className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                >
                  + New form
                </button>
              </div>
              
            </div>
          </div>
        </div>
      </div>

      {isZapierModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">⚡</div>
                  <h2 className="text-2xl font-semibold text-gray-800">Zapier</h2>
                </div>
                <button 
                  onClick={() => setIsZapierModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>


              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      NAME <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Name"
                      value={zapierFormData.name}
                      onChange={(e) => handleZapierFormChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      FORM TYPE <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                    <select
  value={zapierFormData.formType}
  onChange={(e) => handleZapierFormChange('formType', e.target.value)}
  aria-label="Form Type"
  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
>
  <option value="contact">Contact Form</option>
  <option value="application">Candidate Form</option>
</select>

                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      SEND ERRORS TO <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={zapierFormData.sendErrorsTo}
                        onChange={(e) => handleZapierFormChange('sendErrorsTo', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                      >
                        <option value="">Select...</option>
                        <option value="admin@company.com">admin@company.com</option>
                       
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    FIELDS TO SAVE ON FILE
                  </label>
                  <div className="relative">
                    <select
                      value={zapierFormData.fieldsToSave}
                      onChange={(e) => handleZapierFormChange('fieldsToSave', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">Select...</option>
                      <option  value="">No Option to select ...</option>                   
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    onClick={handleZapierDiscard}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleZapierSave}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAddIntegrationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 h-100 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Add Integration</h2>
                <button 
                  onClick={() => setIsAddIntegrationModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    SELECT INTEGRATION TYPE <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={addIntegrationFormData.integrationType}
                      onChange={(e) => handleAddIntegrationFormChange('integrationType', e.target.value)}
                      className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="Webhook integration">Webhook integration</option>
                     
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 pointer-events-none">
                   
                     
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    SELECT ENTITY <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setIsEntityDropdownOpen(!isEntityDropdownOpen)}
                      className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between"
                    >
                      <span className={addIntegrationFormData.entity ? "text-gray-900" : "text-gray-500"}>
                        {addIntegrationFormData.entity || "Select entity"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    
                    {isEntityDropdownOpen && (
                      <div className="absolute top-full left-0 w-full max-w-md mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
                        {['Candidate', 'Contact', 'Client', 'Job', 'Deal'].map((entity) => (
                          <button
                            key={entity}
                            onClick={() => {
                              handleAddIntegrationFormChange('entity', entity);
                              setIsEntityDropdownOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                          >
                            <span className="text-gray-700">{entity}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    WEBHOOK NAME <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Webhook name"
                    value={addIntegrationFormData.webhookName}
                    onChange={(e) => handleAddIntegrationFormChange('webhookName', e.target.value)}
                    className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      WEBHOOK <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Webhook"
                      value={addIntegrationFormData.webhook}
                      onChange={(e) => handleAddIntegrationFormChange('webhook', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      SELECT METHOD <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => setIsMethodDropdownOpen(!isMethodDropdownOpen)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between"
                      >
                        <span className={addIntegrationFormData.method ? "text-gray-900" : "text-gray-500"}>
                          {addIntegrationFormData.method || "Select method"}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </button>
                      
                      {isMethodDropdownOpen && (
                        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
                          {['GET', 'POST', 'PUT'].map((method) => (
                            <button
                              key={method}
                              onClick={() => {
                                handleAddIntegrationFormChange('method', method);
                                setIsMethodDropdownOpen(false);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                            >
                              <span className="text-gray-700">{method}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    onClick={handleAddIntegrationCancel}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddIntegrationSave}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationPage;