# frozen_string_literal: true

module Novabilling
  module PaymentMethods
    module Types
      module CreatePaymentMethodDtoType
        extend Novabilling::Internal::Types::Enum

        CARD = "CARD"
        BANK_ACCOUNT = "BANK_ACCOUNT"
        WALLET = "WALLET"
      end
    end
  end
end
