# frozen_string_literal: true

module Novabilling
  module Invoices
    module Types
      class CreateInvoiceDto < Internal::Types::Model
        field :customer_id, -> { String }, optional: false, nullable: false, api_name: "customerId"
        field :subscription_id, -> { String }, optional: true, nullable: false, api_name: "subscriptionId"
        field :items, -> { Internal::Types::Array[Novabilling::Types::InvoiceItemDto] }, optional: false, nullable: false
        field :due_date, -> { String }, optional: false, nullable: false, api_name: "dueDate"
        field :status, -> { Novabilling::Invoices::Types::CreateInvoiceDtoStatus }, optional: true, nullable: false
        field :invoice_number, -> { String }, optional: true, nullable: false, api_name: "invoiceNumber"
        field :currency, -> { String }, optional: true, nullable: false
        field :paid_at, -> { String }, optional: true, nullable: false, api_name: "paidAt"
        field :created_at, -> { String }, optional: true, nullable: false, api_name: "createdAt"
      end
    end
  end
end
