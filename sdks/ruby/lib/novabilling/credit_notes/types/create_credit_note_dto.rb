# frozen_string_literal: true

module Novabilling
  module CreditNotes
    module Types
      class CreateCreditNoteDto < Internal::Types::Model
        field :invoice_id, -> { String }, optional: false, nullable: false, api_name: "invoiceId"
        field :customer_id, -> { String }, optional: false, nullable: false, api_name: "customerId"
        field :amount, -> { Integer }, optional: false, nullable: false
        field :currency, -> { String }, optional: false, nullable: false
        field :reason, -> { Novabilling::CreditNotes::Types::CreateCreditNoteDtoReason }, optional: false, nullable: false
        field :metadata, -> { Internal::Types::Hash[String, Object] }, optional: true, nullable: false
        field :status, -> { Novabilling::CreditNotes::Types::CreateCreditNoteDtoStatus }, optional: true, nullable: false
        field :created_at, -> { String }, optional: true, nullable: false, api_name: "createdAt"
      end
    end
  end
end
