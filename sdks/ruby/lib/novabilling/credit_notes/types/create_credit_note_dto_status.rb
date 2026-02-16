# frozen_string_literal: true

module Novabilling
  module CreditNotes
    module Types
      module CreateCreditNoteDtoStatus
        extend Novabilling::Internal::Types::Enum

        DRAFT = "DRAFT"
        FINALIZED = "FINALIZED"
        VOIDED = "VOIDED"
      end
    end
  end
end
