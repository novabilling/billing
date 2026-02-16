# frozen_string_literal: true

module Novabilling
  module Types
    class CreditNoteResponse < Internal::Types::Model
      field :id, -> { String }, optional: false, nullable: false
      field :invoice_id, -> { String }, optional: false, nullable: false, api_name: "invoiceId"
      field :customer_id, -> { String }, optional: false, nullable: false, api_name: "customerId"
      field :amount, -> { String }, optional: false, nullable: false
      field :currency, -> { String }, optional: false, nullable: false
      field :reason, -> { Novabilling::Types::CreditNoteResponseReason }, optional: false, nullable: false
      field :status, -> { Novabilling::Types::CreditNoteResponseStatus }, optional: false, nullable: false
      field :metadata, -> { Internal::Types::Hash[String, Object] }, optional: true, nullable: false
      field :created_at, -> { String }, optional: false, nullable: false, api_name: "createdAt"
      field :updated_at, -> { String }, optional: false, nullable: false, api_name: "updatedAt"
    end
  end
end
