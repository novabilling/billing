# frozen_string_literal: true

module Novabilling
  module Types
    class InvoiceResponse < Internal::Types::Model
      field :id, -> { String }, optional: false, nullable: false
      field :invoice_number, -> { String }, optional: false, nullable: false, api_name: "invoiceNumber"
      field :subscription_id, -> { String }, optional: true, nullable: false, api_name: "subscriptionId"
      field :customer_id, -> { String }, optional: false, nullable: false, api_name: "customerId"
      field :amount, -> { String }, optional: false, nullable: false
      field :currency, -> { String }, optional: false, nullable: false
      field :status, -> { Novabilling::Types::InvoiceResponseStatus }, optional: false, nullable: false
      field :due_date, -> { String }, optional: false, nullable: false, api_name: "dueDate"
      field :paid_at, -> { String }, optional: true, nullable: false, api_name: "paidAt"
      field :pdf_url, -> { String }, optional: true, nullable: false, api_name: "pdfUrl"
      field :metadata, -> { Internal::Types::Hash[String, Object] }, optional: true, nullable: false
      field :customer, -> { Novabilling::Types::InvoiceCustomerResponse }, optional: true, nullable: false
      field :created_at, -> { String }, optional: false, nullable: false, api_name: "createdAt"
      field :updated_at, -> { String }, optional: false, nullable: false, api_name: "updatedAt"
    end
  end
end
