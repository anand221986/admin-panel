import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface RolePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PermissionOption = 'owned' | 'everything' | 'none';
type ViewPermissionOption = 'owned' | 'everything';

interface PermissionSection {
  name: string;
  enabled: boolean;
  permissions: {
    view?: ViewPermissionOption;
    edit?: PermissionOption;
    export?: PermissionOption;
    delete?: PermissionOption;
    changeLeadOwner?: PermissionOption;
    candidateRating?: PermissionOption;
  };
}

const TABS = [
  'Recruiting',
  'Sales', 
  'Productivity',
  'Reports',
  'Communication',
  'Dashboards',
  'Configuration'
];

const RolePermissionsModal: React.FC<RolePermissionsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('Recruiting');
  const [roleName, setRoleName] = useState('');

  const [recruitingAccess, setRecruitingAccess] = useState(true);
  const [candidates, setCandidates] = useState<PermissionSection>({
    name: 'CANDIDATES',
    enabled: true,
    permissions: {
      view: 'owned',
      edit: 'owned',
      export: 'owned',
      delete: 'owned',
      changeLeadOwner: 'owned',
      candidateRating: 'owned'
    }
  });

  const [jobs, setJobs] = useState<PermissionSection>({
    name: 'JOBS',
    enabled: true,
    permissions: {
      view: 'owned',
      edit: 'owned',
      export: 'owned',
      delete: 'owned'
    }
  });

  const [revenue, setRevenue] = useState<PermissionSection>({
    name: 'REVENUE',
    enabled: true,
    permissions: {
      view: 'owned',
      edit: 'owned'
    }
  });

  const [salesAccess, setSalesAccess] = useState(true);
  const [contacts, setContacts] = useState<PermissionSection>({
    name: 'CONTACTS',
    enabled: true,
    permissions: {
      view: 'owned',
      edit: 'owned',
      export: 'owned',
      delete: 'owned',
      changeLeadOwner: 'owned'
    }
  });

  const [companies, setCompanies] = useState<PermissionSection>({
    name: 'COMPANIES',
    enabled: true,
    permissions: {
      view: 'owned',
      edit: 'owned',
      export: 'owned',
      delete: 'owned',
      changeLeadOwner: 'owned'
    }
  });

  const [deals, setDeals] = useState<PermissionSection>({
    name: 'DEALS',
    enabled: true,
    permissions: {
      view: 'owned',
      edit: 'owned',
      export: 'owned',
      delete: 'owned',
      changeLeadOwner: 'owned'
    }
  });

  const renderPermissionDropdown = (
    value: PermissionOption | ViewPermissionOption | undefined,
    onChange: (value: any) => void,
    isViewOnly = false
  ) => (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="owned">Owned only</SelectItem>
        <SelectItem value="everything">Everything</SelectItem>
        {!isViewOnly && <SelectItem value="none">None</SelectItem>}
      </SelectContent>
    </Select>
  );

  const renderRecruitingContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-foreground">Recruiting Access</h3>
          <p className="text-xs text-muted-foreground">The permissions below apply to candidates and jobs</p>
        </div>
        <Switch checked={recruitingAccess} onCheckedChange={setRecruitingAccess} />
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">{candidates.name}</span>
          <Switch checked={candidates.enabled} onCheckedChange={(enabled) => setCandidates({...candidates, enabled})} />
        </div>
        
        <div className="space-y-3 pl-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">VIEW</span>
            {renderPermissionDropdown(
              candidates.permissions.view,
              (value) => setCandidates({...candidates, permissions: {...candidates.permissions, view: value}}),
              true
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Unassigned</span>
            <input type="checkbox" className="w-4 h-4" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">EDIT</span>
            {renderPermissionDropdown(
              candidates.permissions.edit,
              (value) => setCandidates({...candidates, permissions: {...candidates.permissions, edit: value}})
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Unassigned</span>
            <input type="checkbox" className="w-4 h-4" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Following</span>
            <input type="checkbox" className="w-4 h-4" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">EXPORT</span>
            <Switch checked={true} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between pl-4">
              <span className="text-xs text-muted-foreground">Hide PII</span>
              <input type="checkbox" className="w-4 h-4" defaultChecked />
            </div>
            <div className="flex items-center justify-between pl-4">
              <span className="text-xs text-muted-foreground">Name</span>
              <input type="checkbox" className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between pl-4">
              <span className="text-xs text-muted-foreground">Email</span>
              <input type="checkbox" className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between pl-4">
              <span className="text-xs text-muted-foreground">Phone</span>
              <input type="checkbox" className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between pl-4">
              <span className="text-xs text-muted-foreground">LinkedIn</span>
              <input type="checkbox" className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">DELETE</span>
            {renderPermissionDropdown(
              candidates.permissions.delete,
              (value) => setCandidates({...candidates, permissions: {...candidates.permissions, delete: value}})
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Unassigned</span>
            <input type="checkbox" className="w-4 h-4" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Following</span>
            <input type="checkbox" className="w-4 h-4" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">CHANGE LEAD OWNER</span>
            {renderPermissionDropdown(
              candidates.permissions.changeLeadOwner,
              (value) => setCandidates({...candidates, permissions: {...candidates.permissions, changeLeadOwner: value}})
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Unassigned</span>
            <input type="checkbox" className="w-4 h-4" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Following</span>
            <input type="checkbox" className="w-4 h-4" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">CANDIDATE RATING</span>
            {renderPermissionDropdown(
              candidates.permissions.candidateRating,
              (value) => setCandidates({...candidates, permissions: {...candidates.permissions, candidateRating: value}})
            )}
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">{jobs.name}</span>
          <Switch checked={jobs.enabled} onCheckedChange={(enabled) => setJobs({...jobs, enabled})} />
        </div>
        
        <div className="space-y-3 pl-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">VIEW</span>
            {renderPermissionDropdown(
              jobs.permissions.view,
              (value) => setJobs({...jobs, permissions: {...jobs.permissions, view: value}}),
              true
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Unassigned</span>
            <input type="checkbox" className="w-4 h-4" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">EDIT</span>
            {renderPermissionDropdown(
              jobs.permissions.edit,
              (value) => setJobs({...jobs, permissions: {...jobs.permissions, edit: value}})
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Unassigned</span>
            <input type="checkbox" className="w-4 h-4" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Following</span>
            <input type="checkbox" className="w-4 h-4" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">EXPORT</span>
            <Switch checked={true} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">DELETE</span>
            {renderPermissionDropdown(
              jobs.permissions.delete,
              (value) => setJobs({...jobs, permissions: {...jobs.permissions, delete: value}})
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Unassigned</span>
            <input type="checkbox" className="w-4 h-4" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Following</span>
            <input type="checkbox" className="w-4 h-4" defaultChecked />
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">{revenue.name}</span>
          <Switch checked={revenue.enabled} onCheckedChange={(enabled) => setRevenue({...revenue, enabled})} />
        </div>
        
        <div className="space-y-3 pl-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">VIEW & EDIT</span>
            {renderPermissionDropdown(
              revenue.permissions.view,
              (value) => setRevenue({...revenue, permissions: {...revenue.permissions, view: value}}),
              true
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Unassigned</span>
            <input type="checkbox" className="w-4 h-4" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Following</span>
            <input type="checkbox" className="w-4 h-4" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSalesContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-foreground">Sales Access</h3>
          <p className="text-xs text-muted-foreground">The permissions below apply to contacts and deals</p>
        </div>
        <Switch checked={salesAccess} onCheckedChange={setSalesAccess} />
      </div>

      {[contacts, companies, deals].map((section, index) => {
        const updateSection = index === 0 ? setContacts : index === 1 ? setCompanies : setDeals;
        return (
          <div key={section.name} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{section.name}</span>
              <Switch checked={section.enabled} onCheckedChange={(enabled) => updateSection({...section, enabled})} />
            </div>
            
            <div className="space-y-3 pl-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">VIEW</span>
                {renderPermissionDropdown(
                  section.permissions.view,
                  (value) => updateSection({...section, permissions: {...section.permissions, view: value}}),
                  true
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Unassigned</span>
                <input type="checkbox" className="w-4 h-4" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Following</span>
                <input type="checkbox" className="w-4 h-4" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">EDIT</span>
                {renderPermissionDropdown(
                  section.permissions.edit,
                  (value) => updateSection({...section, permissions: {...section.permissions, edit: value}})
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Unassigned</span>
                <input type="checkbox" className="w-4 h-4" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Following</span>
                <input type="checkbox" className="w-4 h-4" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">EXPORT</span>
                <Switch checked={true} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">DELETE</span>
                {renderPermissionDropdown(
                  section.permissions.delete,
                  (value) => updateSection({...section, permissions: {...section.permissions, delete: value}})
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Unassigned</span>
                <input type="checkbox" className="w-4 h-4" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Following</span>
                <input type="checkbox" className="w-4 h-4" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">CHANGE LEAD OWNER</span>
                {renderPermissionDropdown(
                  section.permissions.changeLeadOwner,
                  (value) => updateSection({...section, permissions: {...section.permissions, changeLeadOwner: value}})
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Unassigned</span>
                <input type="checkbox" className="w-4 h-4" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Following</span>
                <input type="checkbox" className="w-4 h-4" defaultChecked />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderProductivityContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-foreground">Productivity Access</h3>
          <p className="text-xs text-muted-foreground">The permissions below apply to campaigns and recipes</p>
        </div>
        <Switch checked={true} />
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">CAMPAIGNS</span>
          <Switch checked={true} />
        </div>
        
        <div className="space-y-3 pl-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">VIEW</span>
            {renderPermissionDropdown('owned', () => {}, true)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">EDIT</span>
            {renderPermissionDropdown('owned', () => {})}
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">RECIPES</span>
          <Switch checked={true} />
        </div>
        
        <div className="space-y-3 pl-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">VIEW</span>
            {renderPermissionDropdown('owned', () => {}, true)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">EDIT</span>
            {renderPermissionDropdown('owned', () => {})}
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">TASKS</span>
          <Switch checked={true} />
        </div>
        
        <div className="space-y-3 pl-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">VIEW</span>
            {renderPermissionDropdown('owned', () => {}, true)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">EDIT</span>
            {renderPermissionDropdown('owned', () => {})}
          </div>
        </div>
      </div>
    </div>
  );

  const renderReportsContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-foreground">Reports Access</h3>
          <p className="text-xs text-muted-foreground">The permissions below apply to reports present in the analytics section</p>
        </div>
        <Switch checked={true} />
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">RECRUITING</span>
          <Switch checked={true} />
        </div>
        
        <div className="space-y-2 pl-4">
          {[
            'New Candidates',
            'Number of Placements', 
            'Sourcing Efficiency',
            'Job Pipeline',
            'Disqualification',
            'Time To Hire',
            'Activity',
            'Stage Movement Breakdown',
            'Time To Fill',
            'Interviews',
            'New Jobs',
            'Days In Stage',
            'Job - Days In Status'
          ].map((item) => (
            <div key={item} className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{item}</span>
              <Switch checked={true} />
            </div>
          ))}
        </div>
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">SALES</span>
          <Switch checked={true} />
        </div>
        
        <div className="space-y-2 pl-4">
          {[
            'Revenue',
            'New Contacts',
            'Deals Won',
            'Deals Lost',
            'Companies Created',
            'Deals Created',
            'Activity',
            'Deal Pipeline'
          ].map((item) => (
            <div key={item} className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{item}</span>
              <Switch checked={true} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCommunicationContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-foreground">Communication Access</h3>
          <p className="text-xs text-muted-foreground">The permissions below apply to which emails/texts/calls the user is able to view</p>
        </div>
        <Switch checked={true} />
      </div>

      <div className="space-y-4">
        {[
          { name: 'Emails', value: 'owned' },
          { name: 'Texts', value: 'owned' },
          { name: 'Calls', value: 'owned' },
          { name: 'Events', value: 'owned' }
        ].map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{item.name}</span>
            {renderPermissionDropdown(item.value as ViewPermissionOption, () => {}, true)}
          </div>
        ))}
      </div>
    </div>
  );

  const renderDashboardsContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-foreground">Dashboards Access</h3>
          <p className="text-xs text-muted-foreground">The permissions below apply to the widgets available in the dashboard section</p>
        </div>
        <Switch checked={true} />
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">WIDGETS</span>
          <Switch checked={true} />
        </div>
        
        <div className="space-y-2 pl-4">
          {[
            'Overview',
            'Live Candidates',
            'Recent Activities',
            'Placements',
            'Event Calendar'
          ].map((item) => (
            <div key={item} className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{item}</span>
              <Switch checked={true} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderConfigurationContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-foreground">Configuration Access</h3>
          <p className="text-xs text-muted-foreground">The permissions below apply to configuration of different entities in Recruiterflow</p>
        </div>
        <Switch checked={true} />
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">TAGS</span>
          <Switch checked={true} />
        </div>
        
        <div className="space-y-3 pl-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">EDIT</span>
            {renderPermissionDropdown('owned', () => {})}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">DELETE</span>
            {renderPermissionDropdown('owned', () => {})}
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">DEPARTMENTS</span>
          <Switch checked={true} />
        </div>
        
        <div className="space-y-3 pl-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">EDIT</span>
            {renderPermissionDropdown('owned', () => {})}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">DELETE</span>
            {renderPermissionDropdown('owned', () => {})}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Recruiting':
        return renderRecruitingContent();
      case 'Sales':
        return renderSalesContent();
      case 'Productivity':
        return renderProductivityContent();
      case 'Reports':
        return renderReportsContent();
      case 'Communication':
        return renderCommunicationContent();
      case 'Dashboards':
        return renderDashboardsContent();
      case 'Configuration':
        return renderConfigurationContent();
      default:
        return renderRecruitingContent();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 bg-background flex flex-col overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-medium text-foreground">
              Enter role details
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 py-4 border-b flex-shrink-0">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roleName" className="text-sm font-medium text-foreground">
                ROLE NAME *
              </Label>
              <Input
                id="roleName"
                placeholder="Enter role name"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="bg-muted"
              />
            </div>

            <div className="border-b -mb-4">
              <div className="flex space-x-0 overflow-x-auto">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                      activeTab === tab
                        ? 'text-primary border-primary'
                        : 'text-muted-foreground border-transparent hover:text-foreground'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="max-w-full">
            {renderTabContent()}
          </div>
        </div>

        <div className="flex justify-end space-x-3 px-6 py-4 border-t bg-background flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="px-6">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RolePermissionsModal;