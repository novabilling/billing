# frozen_string_literal: true

module Novabilling
  module Types
    class PaymentResponse < Internal::Types::Model
      field :id, -> { String }, optional: false, nullable: false
      field :invoice_id, -> { String }, optional: false, nullable: false, api_name: "invoiceId"
      field :provider, -> { String }, optional: false, nullable: false
      field :provider_transaction_id, -> { String }, optional: true, nullable: false, api_name: "providerTransactionId"
      field :amount, -> { String }, optional: false, nullable: false
      field :currency, -> { String }, optional: false, nullable: false
      field :status, -> { Novabilling::Types::PaymentResponseStatus }, optional: false, nullable: false
      field :failure_reason, -> { String }, optional: true, nullable: false, api_name: "failureReason"
      field :metadata, -> { Internal::Types::Hash[String, Object] }, optional: true, nullable: false
      field :created_at, -> { String }, optional: false, nullable: false, api_name: "createdAt"
      field :updated_at, -> { String }, optional: false, nullable: false, api_name: "updatedAt"
    end
  end
end
