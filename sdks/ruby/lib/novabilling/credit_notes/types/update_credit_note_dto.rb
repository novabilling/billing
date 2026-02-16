# frozen_string_literal: true

module Novabilling
  module CreditNotes
    module Types
      class UpdateCreditNoteDto < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
        field :amount, -> { Integer }, optional: true, nullable: false
        field :reason, -> { Novabilling::CreditNotes::Types::UpdateCreditNoteDtoReason }, optional: true, nullable: false
        field :metadata, -> { Internal::Types::Hash[String, Object] }, optional: true, nullable: false
      end
    end
  end
end
