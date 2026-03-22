import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BusinessData } from '@shared/schema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { businessCategories } from '@shared/schema';

interface StepBusinessDetailsProps {
  form: UseFormReturn<BusinessData>;
}

export function StepBusinessDetails({ form }: StepBusinessDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Location Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-map-marker-alt mr-3 text-blue-500"></i>
            Location Header
          </CardTitle>
          <CardDescription>
            Top page header showing specific zip codes and services (e.g., "Andover MA 01810 • Andover MA 01812 | Siding installation • Siding replacement")
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="primaryZipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Zip Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 01810" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="secondaryZipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary Zip Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 01812" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="specificServices"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specific Services for Header</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Siding installation • Siding replacement"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-star mr-3 text-yellow-500"></i>
            Hero Section
          </CardTitle>
          <CardDescription>
            The main banner that visitors see first
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="heroService"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Service</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Professional Plumbing Services" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="heroLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Area</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., San Francisco Bay Area" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="heroDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hero Description</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    placeholder="Brief description of your services..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-building mr-3 text-green-500"></i>
            Business Information
          </CardTitle>
          <CardDescription>
            Essential contact details and business info
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Company Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Category *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-60">
                      {businessCategories.map((category: { name: string, competition?: string }) => (
                        <SelectItem key={category.name} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="(555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="contact@yourcompany.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Address *</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St, City, State 12345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="aboutDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>About Your Business</FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    placeholder="Tell customers about your company, experience, and what makes you special..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="businessHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Hours</FormLabel>
                <FormControl>
                  <Input placeholder="Monday-Friday: 8 AM - 6 PM, Saturday: 9 AM - 4 PM" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}