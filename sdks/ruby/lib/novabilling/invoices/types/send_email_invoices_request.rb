# frozen_string_literal: true

module Novabilling
  module Invoices
    module Types
      class SendEmailInvoicesRequest < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
        field :email, -> { String }, optional: true, nullable: false
      end
    end
  end
end
