# frozen_string_literal: true

module Novabilling
  module Types
    class AppliedAddOnResponse < Internal::Types::Model
      field :id, -> { String }, optional: false, nullable: false
      field :add_on_id, -> { String }, optional: false, nullable: false, api_name: "addOnId"
      field :customer_id, -> { String }, optional: false, nullable: false, api_name: "customerId"
      field :subscription_id, -> { String }, optional: true, nullable: false, api_name: "subscriptionId"
      field :amount, -> { String }, optional: false, nullable: false
      field :currency, -> { String }, optional: false, nullable: false
      field :invoice_id, -> { String }, optional: true, nullable: false, api_name: "invoiceId"
      field :created_at, -> { String }, optional: false, nullable: false, api_name: "createdAt"
    end
  end
end
