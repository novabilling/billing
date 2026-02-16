# frozen_string_literal: true

module Novabilling
  module Payments
    module Types
      class CreatePaymentDto < Internal::Types::Model
        field :invoice_id, -> { String }, optional: false, nullable: false, api_name: "invoiceId"
        field :provider, -> { String }, optional: false, nullable: false
        field :amount, -> { Integer }, optional: false, nullable: false
        field :currency, -> { String }, optional: false, nullable: false
        field :status, -> { Novabilling::Payments::Types::CreatePaymentDtoStatus }, optional: false, nullable: false
        field :provider_transaction_id, -> { String }, optional: true, nullable: false, api_name: "providerTransactionId"
        field :failure_reason, -> { String }, optional: true, nullable: false, api_name: "failureReason"
        field :created_at, -> { String }, optional: true, nullable: false, api_name: "createdAt"
      end
    end
  end
end
